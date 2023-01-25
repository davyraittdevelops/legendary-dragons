from behave import given, when, then
import logging
import json
import boto3
from setup import loginAndConnectUser

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

def addCardToDeck(context):
    inventory_card = {
        "card_id": "1",
        "card_name": "Abdel Adrian, Gorion's Ward",
        "colors": "['W']" ,
        "deck_location": "",
        "entity_type": "INVENTORY_CARD",
        "image_url": "https://cards.scryfall.io/png/front/3/9/396f9198-67b6-45d8-91b4-dc853bff9623.png?1660722100",
        "inventory_id":"09660b91-e394-44ca-882d-438eb1cc9d25",
        "last_modified": "2023-01-16",
        "oracle_id": "1",
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
        "deck_name": "White-Blue: Azorius",
        "inventory_card": inventory_card
    }))

    context.detail["card_added_to_deck"] = json.loads(context.ws.recv())

def addCardToSideDeck(context):
    inventory_card = {
        "card_id": "2",
        "card_name": "Black Lotus",
        "colors": "['B']" ,
        "deck_location": "",
        "entity_type": "INVENTORY_CARD",
        "image_url": "https://cards.scryfall.io/png",
        "inventory_id":"09660b91-e394-44ca-882d-438eb1cc9d25",
        "last_modified": "2023-01-16",
        "oracle_id": "2",
        "prices": "{usd_foil: '5000', usd_etched: null, eur_foil: '4500', tix: null, eur: '0.09', …}",
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
        "deck_name": "White-Blue: Azorius",
        "inventory_card": inventory_card
    }))

    context.detail["card_added_to_side_deck"] = json.loads(context.ws.recv())

def getDeck(context):
    context.ws.send(json.dumps({
    "action": "getDeckReq",
    "deck_id": context.detail["create_deck"]["data"]["deck_id"],
    }))

    context.detail["get_deck"] = json.loads(context.ws.recv())
    
def getDecks(context):
    context.ws.send(json.dumps({
        "action": "getDecksReq",
    }))

    context.detail["get_decks"] = json.loads(context.ws.recv())

def removeCardFromDeck(context):
    deck_card = {
        "inventory_card_id": "1",
        "card_name": "Abdel Adrian, Gorion's Ward",
        "colors": "['W']",
        "deck_location": "",
        "entity_type": "DECK_CARD",
        "image_url": "https://cards.scryfall.io/png/front/3/9/396f9198-67b6-45d8-91b4-dc853bff9623.png?1660722100",
        "inventory_id": "09660b91-e394-44ca-882d-438eb1cc9d25",
        "last_modified": "2023-01-16",
        "oracle_id": "1",
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
        "deck_card": deck_card,
        "inventory_id": "09660b91-e394-44ca-882d-438eb1cc9d25"
    }))

    context.detail["removed_card_from_deck"] = json.loads(context.ws.recv())


def removeCardFromSideDeck(context):
    deck_card = {
        "inventory_card_id": "2",
        "card_name": "Black Lotus",
        "colors": "['B']",
        "deck_location": "",
        "entity_type": "SIDE_DECK_CARD",
        "image_url": "https://cards.scryfall.io/png",
        "inventory_id": "09660b91-e394-44ca-882d-438eb1cc9d25",
        "last_modified": "2023-01-16",
        "oracle_id": "2",
        "prices": "{usd_foil: '5000', usd_etched: null, eur_foil: '4500', tix: null, eur: '0.09', …}",
        "rarity": "uncommon",
        "quality": "damaged",
        "set_name": "Commander Legends: Battle for Baldur's Gate",
        "user_id": "870b54fc-22f1-4b4c-83f6-90eac12eaa3c",
    }

    context.ws.send(json.dumps({
        "action": "removeCardFromDeckReq",
        "deck_id": context.detail["create_deck"]["data"]["deck_id"],
        "deck_type": context.detail["deck_type"],
        "deck_card": deck_card,
        "inventory_id": "09660b91-e394-44ca-882d-438eb1cc9d25"
    }))

    context.detail["removed_card_from_side_deck"] = json.loads(context.ws.recv())

def moveCardToDeck(context):
    context.ws.send(json.dumps({
        "action": "moveDeckCardReq",
        "deck_id": context.detail["create_deck"]["data"]["deck_id"],
        "deck_card_id": "1",
        "deck_type": "side_deck"
    }))

    context.detail["moved_card"] = json.loads(context.ws.recv())

def removeDeck(context):
    context.ws.send(json.dumps({
        "action": "removeDeckReq",
        "deck_id": context.detail["create_deck"]["data"]["deck_id"]
    }))

    context.detail["removed_deck"] = json.loads(context.ws.recv())


@given("there is an user and the registered user is logged in")
def step_impl(context):
    loginAndConnectUser(context)

@given("there is an user, the registered user is logged in and has one card in their deck")
def step_impl(context):
    loginAndConnectUser(context)
    context.detail["deck_type"] = "main_deck"
    addCardToDeck(context)
    
@when("I create a new deck")
def step_impl(context):
    createDeck(context)

@when("I request to add a card to the main deck")
def step_impl(context):
    context.detail["deck_type"] = "main_deck"
    addCardToDeck(context)

@when("I request to add a card to the side deck")
def step_impl(context):
    context.detail["deck_type"] = "side_deck"
    addCardToSideDeck(context)

@when("I request to see the details of my deck")
def step_impl(context):
    getDeck(context)

@when("I request for my decks")
def step_impl(context):
    getDecks(context)

@when("I request to remove a card from the main deck")
def step_impl(context):
    context.detail["deck_type"] = "main_deck"
    removeCardFromDeck(context)

@when("I request to remove a card from the side deck")
def step_impl(context):
    context.detail["deck_type"] = "side_deck"
    removeCardFromSideDeck(context)

@when("I request to remove a deck")
def step_impl(context):
    removeDeck(context)

@when("I request to move the card to the side deck")
def step_impl(context):
    moveCardToDeck(context)

@then("the deck should be created")
def step_impl(context):
    assert context.detail["create_deck"]["event_type"] == "INSERT_DECK_RESULT"
    assert context.detail["create_deck"]["data"]["entity_type"] == "DECK"
    assert context.detail["create_deck"]["data"]["deck_type"] == "COMMANDER"
    assert context.detail["create_deck"]["data"]["deck_name"] == "White-Blue: Azorius"

@then("the main deck collection is updated and should contain the new card")
def step_impl(context):
    assert context.detail["card_added_to_deck"]["event_type"] == "INSERT_DECK_CARD_RESULT"
    assert context.detail["card_added_to_deck"]["data"]["entity_type"] == "DECK_CARD"
    assert context.detail["card_added_to_deck"]["data"]["card_name"] == "Abdel Adrian, Gorion's Ward"
    assert context.detail["card_added_to_deck"]["data"]["colors"] == "['W']"
    assert context.detail["card_added_to_deck"]["data"]["quality"] == "damaged"
    assert context.detail["card_added_to_deck"]["data"]["deck_id"] == context.detail["create_deck"]["data"]["deck_id"]

@then("the side deck collection is updated and should contain the new card")
def step_impl(context):
    assert context.detail["card_added_to_side_deck"]["event_type"] == "INSERT_SIDE_DECK_CARD_RESULT"
    assert context.detail["card_added_to_side_deck"]["data"]["entity_type"] == "SIDE_DECK_CARD"
    assert context.detail["card_added_to_side_deck"]["data"]["card_name"] == "Black Lotus"
    assert context.detail["card_added_to_side_deck"]["data"]["colors"] == "['B']"
    assert context.detail["card_added_to_side_deck"]["data"]["quality"] == "damaged"
    assert context.detail["card_added_to_side_deck"]["data"]["deck_id"] == context.detail["create_deck"]["data"]["deck_id"]

@then("I should be able to see my deck details including main deck and side deck cards")
def step_impl(context):
    assert context.detail["get_deck"]["event_type"] == "GET_DECK_RESULT"
    assert context.detail["get_deck"]["data"]["deck"]["deck_id"] == context.detail["create_deck"]["data"]["deck_id"]
    assert context.detail["get_deck"]["data"]["deck"]["deck_name"] == "White-Blue: Azorius"
    assert context.detail["get_deck"]["data"]["deck"]["entity_type"] == "DECK"

    # Main Deck
    assert context.detail["get_deck"]["data"]["deck_cards"][0]["entity_type"] == "DECK_CARD"
    assert context.detail["get_deck"]["data"]["deck_cards"][0]["card_name"] == "Abdel Adrian, Gorion's Ward"
    assert context.detail["get_deck"]["data"]["deck_cards"][0]["quality"] == "damaged"
    assert context.detail["get_deck"]["data"]["deck_cards"][0]["rarity"] == "uncommon"
    assert context.detail["get_deck"]["data"]["deck_cards"][0]["colors"] == "['W']"
    assert context.detail["get_deck"]["data"]["deck_cards"][0]["inventory_card_id"] == "1"

    # Side Deck
    assert context.detail["get_deck"]["data"]["side_deck_cards"][0]["entity_type"] == "SIDE_DECK_CARD"
    assert context.detail["get_deck"]["data"]["side_deck_cards"][0]["card_name"] == "Black Lotus"
    assert context.detail["get_deck"]["data"]["side_deck_cards"][0]["quality"] == "damaged"
    assert context.detail["get_deck"]["data"]["side_deck_cards"][0]["rarity"] == "uncommon"
    assert context.detail["get_deck"]["data"]["side_deck_cards"][0]["colors"] == "['B']"
    assert context.detail["get_deck"]["data"]["side_deck_cards"][0]["inventory_card_id"] == "2"

@then("I should be able to see all my decks")
def step_impl(context):
    assert context.detail["get_decks"]["event_type"] == "GET_DECKS_RESULT"
    assert context.detail["get_decks"]["data"][0]["deck_type"] == "COMMANDER"
    assert context.detail["get_decks"]["data"][0]["entity_type"] == "DECK"
    assert context.detail["get_decks"]["data"][0]["deck_name"] == "White-Blue: Azorius"

@then("the main deck collection is updated and the card is removed")
def step_impl(context):
    assert context.detail["removed_card_from_deck"]["event_type"] == "REMOVE_DECK_CARD_RESULT"

    assert context.detail["removed_card_from_deck"]["data"]["entity_type"] == "DECK_CARD"
    assert context.detail["removed_card_from_deck"]["data"]["card_name"] == "Abdel Adrian, Gorion's Ward"
    assert context.detail["removed_card_from_deck"]["data"]["quality"] == "damaged"
    assert context.detail["removed_card_from_deck"]["data"]["rarity"] == "uncommon"

@then("the side deck collection is updated and the card is removed")
def step_impl(context):
    assert context.detail["removed_card_from_side_deck"]["event_type"] == "REMOVE_SIDE_DECK_CARD_RESULT"

    assert context.detail["removed_card_from_side_deck"]["data"]["entity_type"] == "SIDE_DECK_CARD"
    assert context.detail["removed_card_from_side_deck"]["data"]["card_name"] == "Black Lotus"
    assert context.detail["removed_card_from_side_deck"]["data"]["quality"] == "damaged"
    assert context.detail["removed_card_from_side_deck"]["data"]["rarity"] == "uncommon"

@then("the side deck collection should contain the moved card")
def step_impl(context):
    assert context.detail["moved_card"]["event_type"] == "MODIFY_SIDE_DECK_CARD_RESULT"
    assert context.detail["moved_card"]["data"]["entity_type"] == "SIDE_DECK_CARD"
    assert context.detail["moved_card"]["data"]["card_name"] == "Abdel Adrian, Gorion's Ward"
    assert context.detail["moved_card"]["data"]["quality"] == "damaged"
    assert context.detail["moved_card"]["data"]["rarity"] == "uncommon"
    assert context.detail["moved_card"]["data"]["colors"] == "['W']"

    context.detail["deck_type"] = "side_deck"
    removeCardFromDeck(context)

@then("the deck should be removed from all my decks")
def step_impl(context):
    assert context.detail["removed_deck"]["event_type"] == "REMOVE_DECK_RESULT"
    assert context.detail["removed_deck"]["data"]["entity_type"] == "DECK"
    assert context.detail["removed_deck"]["data"]["deck_name"] == "White-Blue: Azorius"
