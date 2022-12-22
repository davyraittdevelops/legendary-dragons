from behave import given, when, then
import requests
import logging
import uuid
import json
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = boto3.client("cognito-idp", region_name="us-east-1")

@given("we have no user")
def step_impl(context):
    context.nickname = uuid.uuid4().hex
    logger.info(f"Generated nickname: ${context.nickname}")

@given("we have a registered user with email '{email}' and password '{password}'")
@when("we register with email '{email}' and password '{password}'")
def step_impl(context, email, password):
    body = {"nickname": context.nickname, "email": email, "password": password}
    logger.info(f"{context.base_url}/users/register")
    response = requests.post(
        f"{context.base_url}/users/register",
        json.dumps(body)
    )
    context.detail["email"] = email
    context.status_code = response.status_code

@when("we login the existing user")
def step_impl(context):
    response = client.initiate_auth(
    ClientId="55h918ad6191srnlgj0duprpf3",
    AuthFlow='USER_PASSWORD_AUTH',
    AuthParameters={
        "USERNAME": context.detail["email"],
        "PASSWORD": "Th3bestPassword!"
    }
)
    context.token = response['AuthenticationResult']['IdToken']

@then("the user should be registered")
def step_impl(context):
    client.admin_confirm_sign_up(
    UserPoolId="us-east-1_H1AyV4HD1",
    Username=context.detail["email"])

    logger.info(f"statuscode: ${context.status_code}")
    assert context.status_code == 201

@then("the user should be logged in")
def step_impl(context):
    logger.info(f"jwttoken: ${context.token}")
    assert context.token != ""
