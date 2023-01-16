import time

from behave import given, when, then
import requests
import logging
import json
import boto3
import websocket

logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = boto3.client("cognito-idp", region_name="us-east-1")


def registerUser(context, email, password):
    body = {"nickname": context.nickname, "email": email, "password": password}
    logger.info(f"{context.base_url}/users/register")

    response = requests.post(
        f"{context.base_url}/users/register",
        json.dumps(body)
    )

    context.detail["email"] = email
    context.detail["password"] = password
    context.status_code = response.status_code


def verifyUser(context):
    client.admin_confirm_sign_up(
    UserPoolId="us-east-1_H1AyV4HD1",
    Username=context.detail["email"])

    logger.info(f"statuscode: ${context.status_code}")
    assert context.status_code == 201


def loginUser(context):
    body = {"email": context.detail["email"], "password": context.detail["password"]}
    logger.info(f"{context.base_url}/users/login")

    response = requests.post(
        f"{context.base_url}/users/login",
        json.dumps(body),
    )

    context.token = response.headers["x-amzn-Remapped-Authorization"].replace('Bearer ', '')


def onConnect(context):
    context.ws = websocket.WebSocket()
    context.ws.connect(url=context.websocket_url + "?token=" + context.token)


def onDiscconect(context):
    context.ws.close()

def getInventory(context):
    context.ws.send(json.dumps({
        "action": "getInventoryReq",
    }))

    context.detail["get_inventory"] = json.loads(context.ws.recv())

def addCardtoInventory(context):
    context.ws.send(json.dumps({
        "action": "addCardToInventoryReq",
        "inventory_id": context.detail["get_inventory"]["data"]["inventory_id"],
        "inventory_card": context.card
    }))

    context.detail["add_card_to_inventory"] = json.loads(context.ws.recv())

def removeCardFromInventory(context):
    context.ws.send(json.dumps({
        "action": "removeCardFromInventoryReq",
        'inventory_card_id': context.detail["add_card_to_inventory"]["data"]["card_id"],
        'inventory_id': context.detail["get_inventory"]["data"]["inventory_id"]
    }))
    
    context.detail["remove_card_from_inventory"] = json.loads(context.ws.recv())

    print(context.detail["remove_card_from_inventory"])


@given("there is an existing user and the user is logged in")
def step_impl(context):
    registerUser(context, "LegendaryDragonsMinor@gmail.com", "Eindopdracht3!")

    if not context.detail["verified"]:
        verifyUser(context)
        context.detail["verified"] = True

    loginUser(context)
    onConnect(context)

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


@when("we add the card with the received data to the inventory")
def step_impl(context):
    getInventory(context)
    addCardtoInventory(context)

@when("I request for my inventory")
def step_impl(context):
    getInventory(context)


@when("we remove the card with the received data from the inventory")
def step_impl(context):
    getInventory(context)
    addCardtoInventory(context)
    removeCardFromInventory(context)

@then("the inventory should contain a new card")
def step_impl(context):
    assert context.detail["add_card_to_inventory"]["event_type"] == "INSERT_INVENTORY_CARD_RESULT"
    assert context.detail["add_card_to_inventory"]["data"]["card_name"] == context.card["card_name"]


@then("I should be able to see my collection")
def step_impl(context):
    assert context.detail["get_inventory"]["event_type"] == "GET_INVENTORY_RESULT"
    assert context.detail["get_inventory"]["data"]["entity_type"] == "INVENTORY"


@then("the card should be removed from the inventory")
def step_impl(context):
    assert context.detail["remove_card_from_inventory"]["event_type"] == "REMOVE_INVENTORY_CARD_RESULT"
    assert context.detail["remove_card_from_inventory"]["data"]["inventory_id"] == context.detail["get_inventory"]["data"]["inventory_id"]