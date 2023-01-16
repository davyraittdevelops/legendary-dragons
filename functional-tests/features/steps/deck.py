
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
    context.ws.connect(url=context.websocket_url + "?token=" + context.token)

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
