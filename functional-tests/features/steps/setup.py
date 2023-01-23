import requests
import logging
import json
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = boto3.client("cognito-idp", region_name="us-east-1")

def registerUser(context, email, password):
    body = {"nickname": "Legendary Dragons", "email": email, "password": password}
    logger.info(f"{context.base_url}/users/register")

    response = requests.post(
        f"{context.base_url}/users/register",
        json.dumps(body)
    )

    # client.admin_confirm_sign_up(
    # UserPoolId="us-east-1_H1AyV4HD1",
    # Username="LegendaryDragonsMinor@gmail.com")

    context.detail["email"] = email
    context.detail["password"] = password
    context.status_code = response.status_code

def loginUser(context, email, password):
    body = {"email": email, "password": password}
    logger.info(f"{context.base_url}/users/login")

    response = requests.post(
        f"{context.base_url}/users/login",
        json.dumps(body),
    )

    context.status_code = response.status_code
    context.headers = response.headers
    context.token = response.headers["x-amzn-Remapped-Authorization"].replace('Bearer ', '')


def loginAndConnectUser(context):
    loginUser(context, "LegendaryDragonsMinorTest@gmail.com", "Eindopdracht3!")
    context.ws.connect(url=context.websocket_url + "?token=" + context.token)
