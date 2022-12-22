from behave import given, when, then
import requests
import logging
import uuid
import json

logger = logging.getLogger()
logger.setLevel(logging.INFO)


@given("we have a new user")
def step_impl(context):
    context.nickname = uuid.uuid4().hex
    logger.info(f"Generated nickname: ${context.nickname}")


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


@then("the user should be registered")
def step_impl(context):
    # TODO: add admin_confirm_sign_up
    assert context.status_code == 201
