from behave import given, when, then
import logging
import json
import boto3
from setup import registerVerifyLoginConnectUser

logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = boto3.client("cognito-idp", region_name="us-east-1")

@given("there is an user and the user is logged in")
def step_impl(context):
    registerVerifyLoginConnectUser(context)

@when("we have a request for searching cards with keyword '{keyword}'")
def step_impl(context, keyword):
    context.query = keyword

    context.ws.send(json.dumps({
        "action": "searchCardsByKeywordReq",
        "query": context.query
    }))

@then("there should be a result of cards")
def step_impl(context):
    result = json.loads(context.ws.recv())
    assert result['event_type'] == 'SEARCH_CARD_RESULT'
    assert result['data'][0]['card_name'] == context.query
