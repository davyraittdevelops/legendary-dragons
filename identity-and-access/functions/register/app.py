import json
import logging
import os
from datetime import datetime
import boto3
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

client = boto3.client("cognito-idp")
events_client = boto3.client("events")


def create_error_response(code: int, message: str):
    return {
        "statusCode": code,
        "body": json.dumps({"message": message})
    }


def lambda_handler(event, context):
    """Register a new user with AWS Cognito."""
    body = json.loads(event["body"])

    nickname = body["nickname"]
    email = body["email"]
    password = body["password"]
    output = {"statusCode": 201}

    if len(email.strip()) == 0:
        logger.info("Registration failed: empty email received")
        return create_error_response(400, "Email cannot be empty.")

    logger.info(f"Registering account with nickname: {nickname}")

    try:
        response = client.sign_up(
            ClientId=os.environ["COGNITO_CLIENT"],
            Username=email, Password=password,
            UserAttributes=[
                {"Name": "email", "Value": email},
                {"Name": "nickname", "Value": nickname}
            ]
        )

        events_client.put_events(Entries=[
            {
                "Time": datetime.now(),
                "Source": "legdragons.identity-and-access.signup",
                "DetailType": "USER_REGISTERED",
                "Detail": json.dumps({"user_id": response["UserSub"]}),
                "EventBusName": os.getenv("EVENT_BUS_NAME")
            }
        ])

    except client.exceptions.InvalidPasswordException as e:
        error = str(e)[str(e).index(":") + 1:len(str(e))]
        logger.info(f"Registration failed: {error}")
        output = create_error_response(400, error.strip())
    except client.exceptions.InvalidParameterException as e:
        error = str(e)[str(e).index(":") + 1:len(str(e))]
        logger.info(f"Registration failed: {error}")
        output = create_error_response(400, error.strip())
    except client.exceptions.UsernameExistsException as e:
        error = str(e)[str(e).index(":") + 1:len(str(e))]
        logger.info(f"Registration failed: {error}")
        output = create_error_response(409, str(e))

    return output
