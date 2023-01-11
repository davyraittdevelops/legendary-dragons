import json
import logging
import os
import requests
import time
from jose import jwk, jwt
from jose.utils import base64url_decode
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()


region = os.environ["AWS_REGION"]
userpool_id = os.environ["USERPOOL_ID"]
app_client_id = os.environ["APP_CLIENT_ID"]
keys_url = "https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json".format(region, userpool_id)

response = requests.get(keys_url)
keys = response.json()["keys"]


def lambda_handler(event, context):
    """Authorize the incoming request based on the provided JWT."""
    token = event["queryStringParameters"]["token"]
    deny_policy = create_deny_policy()

    # Get the kid from the headers prior to verification
    headers = jwt.get_unverified_headers(token)
    kid = headers["kid"]

    # Search for the kid in the downloaded public keys
    key_index = -1
    for i in range(len(keys)):
        if kid == keys[i]["kid"]:
            key_index = i
            break
    if key_index == -1:
        logger.info("Public key not found in jwks.json")
        return deny_policy

    public_key = jwk.construct(keys[key_index])

    # Get the last two sections of the token,
    # message and signature (encoded in base64)
    message, encoded_signature = str(token).rsplit(".", 1)

    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))

    if not public_key.verify(message.encode("utf8"), decoded_signature):
        logger.info("Signature verification failed")
        return deny_policy

    logger.info("Signature successfully verified")

    claims = jwt.get_unverified_claims(token)

    if time.time() > claims["exp"]:
        logger.info("Token is expired")
        return deny_policy

    if claims["aud"] != app_client_id:
        logger.info("Token was not issued for this audience")
        return deny_policy

    return create_allow_policy(claims["sub"], event["methodArn"])


def create_deny_policy():
    """Create a policy to deny the incoming request."""
    return {
        "principalId": "*",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Action": "*",
                    "Effect": "Deny",
                    "Resource": "*",
                },
            ]
        }
    }


def create_allow_policy(sub_claim, method_arn):
    """Create a policy to allow the incoming request & add user id."""
    return {
        "principalId": sub_claim,
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "execute-api:Invoke",
                    "Resource": method_arn
                }
            ]
        },
        "context": {
            "userId": sub_claim
        }
    }
