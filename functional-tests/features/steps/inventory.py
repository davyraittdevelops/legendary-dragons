from behave import given, when, then
import requests
import logging
import uuid
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


@given("I have an inventory")
def step_impl(context):
    registerUser(context, "LegendaryDragonsMinor@gmail.com", "Eindopdracht3!")

    if not context.detail["verified"]:
        verifyUser(context)

    loginUser(context)
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
    onConnect(context)
    context.ws.send(json.dumps({
        "action": "addCardToInventoryReq",
        "inventory_id": None,
        "inventory_card": context.card
    }))


@when("I request for my inventory")
def step_impl(context):
    onConnect(context)
    context.ws.send(json.dumps({
        "action": "getInventoryReq",
    }))


@then("the inventory should contain a new card")
def step_impl(context):
    result = json.loads(context.ws.recv())
    second_result = json.loads(context.ws.recv())

    if result["event_type"] == "INSERT_INVENTORY_RESULT":
        tmp = result
        result = second_result
        second_result = tmp

    assert result["event_type"] == "INSERT_INVENTORY_CARD_RESULT"
    assert result["data"]["card_name"] == context.card["card_name"]
    context.detail["verified"] = True


@then("I should be able to see my collection")
def step_impl(context):
    result = json.loads(context.ws.recv())
    assert result["event_type"] == "GET_INVENTORY_RESULT"
    assert result["data"]["entity_type"] == "INVENTORY"
