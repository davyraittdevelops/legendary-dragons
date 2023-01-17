from behave import given, when, then
import logging
import json
import boto3
from setup import registerUser, verifyUser, loginUser, onConnect

logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = boto3.client("cognito-idp", region_name="us-east-1")

def createDeck(context):
    context.ws.send(json.dumps({
        "action": "createDeckReq",
        "deck_name": "White-Blue: Azorius",
        "deck_type": "COMMANDER"
    }))

    context.detail["create_deck"] = json.loads(context.ws.recv())

@given("there is an user and the registered user is logged in")
def step_impl(context):
    registerUser(context, "LegendaryDragonsMinor@gmail.com", "Eindopdracht3!")
    verifyUser(context)
    loginUser(context)
    onConnect(context)

@when("I create a new deck")
def step_impl(context):
    createDeck(context)

@then("the deck should be created")
def step_impl(context):
    print(context.detail["create_deck"])
    assert context.detail["create_deck"]["event_type"] == "INSERT_DECK_RESULT"
    assert context.detail["create_deck"]["data"]["entity_type"] == "DECK"
    assert context.detail["create_deck"]["data"]["deck_type"] == "COMMANDER"
    assert context.detail["create_deck"]["data"]["deck_name"] == "White-Blue: Azorius"
