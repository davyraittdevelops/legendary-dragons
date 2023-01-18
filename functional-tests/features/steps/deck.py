from behave import given, when, then
import logging
import json
import boto3
from setup import registerVerifyLoginConnectUser

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
    
def getDecks(context):
    context.ws.send(json.dumps({
        "action": "getDeckReq",
    }))

    context.detail["get_deck"] = json.loads(context.ws.recv())

def removeDeck(context):
    context.ws.send(json.dumps({
        "action": "removeDeckReq",
        "deck_id": context.detail["create_deck"]["data"]["deck_id"]
    }))

    context.detail["removed_deck"] = json.loads(context.ws.recv())


@given("there is an user and the registered user is logged in")
def step_impl(context):
    registerVerifyLoginConnectUser(context)
    
@given("there is an existing user, the user is logged in and the user has atleast one deck")
def step_impl(context):
    registerVerifyLoginConnectUser(context)
    createDeck(context)

@when("I create a new deck")
def step_impl(context):
    createDeck(context)

@when("I request for my decks")
def step_impl(context):
    getDecks(context)

@when("I request to remove a deck")
def step_impl(context):
    removeDeck(context)

@then("the deck should be created")
def step_impl(context):
    print(context.detail["create_deck"])
    assert context.detail["create_deck"]["event_type"] == "INSERT_DECK_RESULT"
    assert context.detail["create_deck"]["data"]["entity_type"] == "DECK"
    assert context.detail["create_deck"]["data"]["deck_type"] == "COMMANDER"
    assert context.detail["create_deck"]["data"]["deck_name"] == "White-Blue: Azorius"

@then("I should be able to see all my decks")
def step_impl(context):
    assert context.detail["get_deck"]["event_type"] == "GET_DECK_RESULT"
    assert len(context.detail["get_deck"]["data"]) == 1

@then("the deck should be removed from all my decks")
def step_impl(context):
    assert context.detail["removed_deck"]["event_type"] == "REMOVE_DECK_RESULT"
    assert context.detail["removed_deck"]["data"]["entity_type"] == "DECK"
    assert context.detail["removed_deck"]["data"]["deck_name"] == "White-Blue: Azorius"