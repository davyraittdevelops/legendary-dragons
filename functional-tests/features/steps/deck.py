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
        "action": "getDecksReq",
    }))

    context.detail["get_decks"] = json.loads(context.ws.recv())

def removeDeck(context):
    context.ws.send(json.dumps({
        "action": "removeDeckReq",
        "deck_id": context.detail["create_deck"]["data"]["deck_id"]
    }))

    context.detail["removed_deck"] = json.loads(context.ws.recv())


def addCardToDeck(context):
    inventory_card = {
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

def removeCardFromDeck(context):
    deck_card = {
        "inventory_card_id": "0783c3f7-3f48-443f-9f30-a8094f8fca53",
        "card_name": "Abdel Adrian, Gorion's Ward",
        "colors": "['W']",
        "deck_location": "",
        "entity_type": "DECK_CARD",
        "image_url": "https://cards.scryfall.io/png/front/3/9/396f9198-67b6-45d8-91b4-dc853bff9623.png?1660722100",
        "inventory_id": "09660b91-e394-44ca-882d-438eb1cc9d25",
        "last_modified": "2023-01-16",
        "oracle_id": "cab092f9-b7ff-43b9-935f-310869a4daf8",
        "prices": "{usd_foil: '0.80', usd_etched: null, eur_foil: '0.18', tix: null, eur: '0.09', …}",
        "rarity": "uncommon",
        "quality": "damaged",
        "set_name": "Commander Legends: Battle for Baldur's Gate",
        "user_id": "870b54fc-22f1-4b4c-83f6-90eac12eaa3c",
    }


    context.ws.send(json.dumps({
        "action": "removeCardFromDeckReq",
        "deck_id": context.detail["create_deck"]["data"]["deck_id"],
        "deck_type": context.detail["deck_type"],
        "deck_card": deck_card
    }))

    context.detail["removed_card_from_deck"] = json.loads(context.ws.recv())

def getDeck(context):
    context.ws.send(json.dumps({
    "action": "getDeckReq",
    "deck_id": context.detail["create_deck"]["data"]["deck_id"],
    }))

    context.detail["get_deck"] = json.loads(context.ws.recv())

@given("there is an user and the registered user is logged in")
def step_impl(context):
    registerVerifyLoginConnectUser(context)
    
@given("there is an existing user, the user is logged in and the user has atleast one deck")
def step_impl(context):
    registerVerifyLoginConnectUser(context)
    createDeck(context)

@given("there is an existing user, the user is logged in, the user has atleast one deck and the deck contains cards")
def step_impl(context):
    registerVerifyLoginConnectUser(context)
    createDeck(context)

    # Add one card to main deck
    context.detail["deck_type"] = "main_deck"
    addCardToDeck(context)

    # Add one card to side deck
    context.detail["deck_type"] = "side_deck"
    addCardToDeck(context)

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

@when("I request to see the details of my deck")
def step_impl(context):
    getDeck(context)

@when("I request to remove a card from the main deck")
def step_impl(context):
    context.detail["deck_type"] = "main_deck"
    removeCardFromDeck(context)

@when("I request to remove a card from the side deck")
def step_impl(context):
    context.detail["deck_type"] = "side_deck"
    removeCardFromDeck(context)

@then("the deck should be created")
def step_impl(context):
    assert context.detail["create_deck"]["event_type"] == "INSERT_DECK_RESULT"
    assert context.detail["create_deck"]["data"]["entity_type"] == "DECK"
    assert context.detail["create_deck"]["data"]["deck_type"] == "COMMANDER"
    assert context.detail["create_deck"]["data"]["deck_name"] == "White-Blue: Azorius"

@then("I should be able to see all my decks")
def step_impl(context):
    assert context.detail["get_decks"]["event_type"] == "GET_DECKS_RESULT"
    assert len(context.detail["get_decks"]["data"]) == 1

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

@then("I should be able to see my deck details including main deck and side deck cards")
def step_impl(context):
    print(context.detail["get_deck"])
    assert context.detail["get_deck"]["event_type"] == "GET_DECK_RESULT"
    assert context.detail["get_deck"]["data"]["deck"]["deck_id"] == context.detail["create_deck"]["data"]["deck_id"]
    assert context.detail["get_deck"]["data"]["deck"]["deck_name"] == "White-Blue: Azorius"

    # Main Deck
    assert context.detail["get_deck"]["data"]["deck_cards"][0]["entity_type"] == "DECK_CARD"
    assert context.detail["get_deck"]["data"]["deck_cards"][0]["card_name"] == "Abdel Adrian, Gorion's Ward"
    assert context.detail["get_deck"]["data"]["deck_cards"][0]["quality"] == "damaged"
    assert context.detail["get_deck"]["data"]["deck_cards"][0]["rarity"] == "uncommon"

    # Side Deck
    assert context.detail["get_deck"]["data"]["side_deck_cards"][0]["entity_type"] == "DECK_CARD"
    assert context.detail["get_deck"]["data"]["side_deck_cards"][0]["card_name"] == "Abdel Adrian, Gorion's Ward"
    assert context.detail["get_deck"]["data"]["side_deck_cards"][0]["quality"] == "damaged"
    assert context.detail["get_deck"]["data"]["side_deck_cards"][0]["rarity"] == "uncommon"

@then("the deck collection is updated and the card is removed")
def step_impl(context):
    assert context.detail["removed_card_from_deck"]["event_type"] == "REMOVE_DECK_CARD_RESULT"

    assert context.detail["removed_card_from_deck"]["data"]["entity_type"] == "DECK_CARD"
    assert context.detail["removed_card_from_deck"]["data"]["card_name"] == "Abdel Adrian, Gorion's Ward"
    assert context.detail["removed_card_from_deck"]["data"]["quality"] == "damaged"
    assert context.detail["removed_card_from_deck"]["data"]["rarity"] == "uncommon"
