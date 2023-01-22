from behave import given, when, then
import logging
import json
import boto3
from setup import registerVerifyLoginConnectUser

logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = boto3.client("cognito-idp", region_name="us-east-1")

def getInventory(context):
    context.ws.send(json.dumps({
        "action": "getInventoryReq",
    }))

    context.detail["get_inventory"] = json.loads(context.ws.recv())

def addCardtoInventory(context):
    getInventory(context)
    context.card = {
        "oracle_id": "44b8eb8f-fa23-401a-98b5-1fbb9871128e",
        "card_name": "Swords To Plowshares",
        "colors": ["R"],
        "prices": {
            "usd": "1",
            "eur": "1"
        },
        "rarity": "uncommon",
        "quality": "damaged",
        "scryfall_id": "7d839f21-68c7-47db-8407-ff3e2c3e13b4",
    }

    context.ws.send(json.dumps({
        "action": "addCardToInventoryReq",
        "inventory_id": context.detail["get_inventory"]["data"]["inventory_id"],
        "inventory_card": context.card
    }))

    context.detail["add_card_to_inventory"] = json.loads(context.ws.recv())

def removeCardFromInventory(context):
    getInventory(context)
    context.ws.send(json.dumps({
        "action": "removeCardFromInventoryReq",
        'inventory_card_id': context.detail["add_card_to_inventory"]["data"]["card_id"],
        'inventory_id': context.detail["get_inventory"]["data"]["inventory_id"]
    }))

    context.detail["remove_card_from_inventory"] = json.loads(context.ws.recv())

@given("there is an existing user and the user is logged in")
def step_impl(context):
    registerVerifyLoginConnectUser(context)

@when("we add the card with the received data to the inventory")
def step_impl(context):
    addCardtoInventory(context)

@when("I request for my inventory")
def step_impl(context):
    getInventory(context)

@when("we remove the card with the received data from the inventory")
def step_impl(context):
    removeCardFromInventory(context)

@then("the inventory should contain a new card")
def step_impl(context):
    assert context.detail["add_card_to_inventory"]["event_type"] == "INSERT_INVENTORY_CARD_RESULT"
    assert context.detail["add_card_to_inventory"]["data"]["card_name"] == context.card["card_name"]

@then("I should be able to see my collection")
def step_impl(context):
    assert context.detail["get_inventory"]["event_type"] == "GET_INVENTORY_RESULT"
    assert context.detail["get_inventory"]["data"]["entity_type"] == "INVENTORY"
    assert context.detail["get_inventory"]["data"]["inventory_cards"][0]["entity_type"] == "INVENTORY_CARD"
    assert context.detail["get_inventory"]["data"]["inventory_cards"][0]["oracle_id"] == "44b8eb8f-fa23-401a-98b5-1fbb9871128e"
    assert context.detail["get_inventory"]["data"]["inventory_cards"][0]["card_name"] == "Swords To Plowshares"
    assert context.detail["get_inventory"]["data"]["inventory_cards"][0]["oracle_id"] == "44b8eb8f-fa23-401a-98b5-1fbb9871128e"
    assert context.detail["get_inventory"]["data"]["inventory_cards"][0]["rarity"] == "uncommon"
    assert context.detail["get_inventory"]["data"]["inventory_cards"][0]["quality"] == "damaged"
    assert context.detail["get_inventory"]["data"]["inventory_cards"][0]["scryfall_id"] == "7d839f21-68c7-47db-8407-ff3e2c3e13b4"

@then("the card should be removed from the inventory")
def step_impl(context):
    assert context.detail["remove_card_from_inventory"]["event_type"] == "REMOVE_INVENTORY_CARD_RESULT"
    assert context.detail["remove_card_from_inventory"]["data"]["inventory_id"] == context.detail["get_inventory"]["data"]["inventory_id"]
