from behave import given, when, then
import logging
import uuid
import boto3
import requests
import json
from setup import registerUser, loginUser

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

    registerUser(context, context.detail["email"], context.detail["password"])

@when("we login the existing user")
def step_impl(context):
    loginUser(context, context.detail["email"], context.detail["password"])

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

    client.admin_delete_user(
        UserPoolId="us-east-1_H1AyV4HD1",
        Username=context.detail["email"]
    )

    
