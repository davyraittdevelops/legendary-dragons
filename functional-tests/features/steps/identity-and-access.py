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

@given("we register a new user with an email and a password")
@when("we register a new user with an email and a password")
def step_impl(context):
    context.detail["email"] = "LegendaryDragonsMinor@gmail.com"
    context.detail["password"] = "Eindopdracht3!"

    body = {"nickname": context.nickname, "email": context.detail["email"], "password": context.detail["password"]}
    logger.info(f"{context.base_url}/users/register")
    response = requests.post(
        f"{context.base_url}/users/register",
        json.dumps(body)
    )

    context.status_code = response.status_code

@when("we login the existing user")
def step_impl(context):
    body = {"email": context.detail["email"], "password": context.detail["password"]}
    logger.info(f"{context.base_url}/users/login")

    response = requests.post(
        f"{context.base_url}/users/login",
        json.dumps(body)
    )

    context.status_code = response.status_code
    context.headers = response.headers

@then("the user should be registered")
def step_impl(context):
    client.admin_confirm_sign_up(
    UserPoolId="us-east-1_H1AyV4HD1",
    Username=context.detail["email"])

    logger.info(f"statuscode: ${context.status_code}")
    assert context.status_code == 201

@then("the user should be logged in")
def step_impl(context):
    assert context.status_code == 200

    # Assertion for headers
