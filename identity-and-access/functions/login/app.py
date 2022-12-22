import json
import logging
import os
import boto3
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

client = boto3.client("cognito-idp")

def create_error_response(code: int, message: str):
    return {
        "statusCode": code,
        "body": json.dumps({"message": message})
    }

def lambda_handler(event, context):
    """Login a new user with AWS Cognito."""
    body = json.loads(event["body"])

    email = body["email"]
    password = body["password"]
    output = {"statusCode": 200}

    if len(email.strip()) == 0:
        logger.info("Login failed: empty email received")
        return create_error_response(400, "Email cannot be empty.")

    try:
        response = client.initiate_auth(
            ClientId=os.environ["COGNITO_CLIENT"],
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                "USERNAME": email,
                "PASSWORD": password
            }
        )

        token = response['AuthenticationResult']['IdToken']

        output["headers"] = {
            "Authorization": f"Bearer {token}"
        }

    except client.exceptions.UserNotFoundException as e:
        error = str(e)[str(e).index(":") + 1:len(str(e))]
        logger.info(f"Email/password combination is incorrect: {error}")
        output = create_error_response(404, error.strip())
    except client.exceptions.InvalidParameterException as e:
        error = str(e)[str(e).index(":") + 1:len(str(e))]
        logger.info(f"Login failed: {error}")
        output = create_error_response(400, error.strip())
    except client.exceptions.UserNotConfirmedException as e:
        error = str(e)[str(e).index(":") + 1:len(str(e))]
        logger.info(f"User not confirmed: {error}")
        output = create_error_response(403, error.strip())
    except client.exceptions.NotAuthorizedException as e:
        error = str(e)[str(e).index(":") + 1:len(str(e))]
        logger.info(f"Incorrect email or password: {error}")
        output = create_error_response(403, error.strip())

    return output
