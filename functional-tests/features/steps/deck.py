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


def addCardToDeck(context):
    inventory_card = {
        "GSI1_PK": "INVENTORY#09660b91-e394-44ca-882d-438eb1cc9d25",
        "GSI1_SK": "INVENTORY_CARD#0783c3f7-3f48-443f-9f30-a8094f8fca53",
        "PK": "INVENTORY_CARD#0783c3f7-3f48-443f-9f30-a8094f8fca53",
        "SK": "INVENTORY#09660b91-e394-44ca-882d-438eb1cc9d25",
        "card_id": "0783c3f7-3f48-443f-9f30-a8094f8fca53",
        "card_name": "Abdel Adrian, Gorion's Ward",
        "colors": "['W']" ,
        "deck_location": "",
        "entity_type": "INVENTORY_CARD",
        "image_url": "https://cards.scryfall.io/png/front/3/9/396f9198-67b6-45d8-91b4-dc853bff9623.png?1660722100",
        "inventory_id":"09660b91-e394-44ca-882d-438eb1cc9d25",
        "last_modified": "2023-01-16",
        "oracle_id": "cab092f9-b7ff-43b9-935f-310869a4daf8",
        "prices": "{usd_foil: '0.80', usd_etched: null, eur_foil: '0.18', tix: null, eur: '0.09', …}",
        "rarity": "uncommon",
        "quality": "damaged",
        "scryfall_id": "396f9198-67b6-45d8-91b4-dc853bff9623",
        "set_name": "Commander Legends: Battle for Baldur's Gate",
        "user_id": "870b54fc-22f1-4b4c-83f6-90eac12eaa3c",
    }

    context.ws.send(json.dumps({
        "action": "addCardToDeckReq",
        "deck_id": context.detail["create_deck"]["data"]["deck_id"],
        "deck_type": context.detail["deck_type"],
        "inventory_card": inventory_card
    }))

    context.detail["card_added_to_deck"] = json.loads(context.ws.recv())


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

@when("I request to add a card to the main deck")
def step_impl(context):
    context.detail["deck_type"] = "main_deck"
    addCardToDeck(context)

@when("I request to add a card to the side deck")
def step_impl(context):
    context.detail["deck_type"] = "side_deck"
    addCardToDeck(context)

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

@then("the deck collection is updated and should contain the new card")
def step_impl(context):
    assert context.detail["card_added_to_deck"]["event_type"] == "INSERT_DECK_CARD_RESULT"
    assert context.detail["card_added_to_deck"]["data"]["entity_type"] == "DECK_CARD"
    assert context.detail["card_added_to_deck"]["data"]["card_name"] == "Abdel Adrian, Gorion's Ward"
    assert context.detail["card_added_to_deck"]["data"]["quality"] == "damaged"
    assert context.detail["card_added_to_deck"]["data"]["deck_id"] == context.detail["create_deck"]["data"]["deck_id"]
