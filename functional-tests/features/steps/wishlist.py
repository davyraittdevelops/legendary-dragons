from behave import given, when, then
import logging
import json
import boto3
from setup import loginAndConnectUser

logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = boto3.client("cognito-idp", region_name="us-east-1")

def createPriceAlert(context, price_point):
    context.ws.send(json.dumps({
        "action": "createAlertReq",
        "wishlist_item_id": "1", 
        "alert_item": {
            "entity_type": "ALERT#PRICE",
            "alert_type": "PRICE",
            "price_point": price_point,
            "wishlist_item_id": "1",
            "card_market_id": "1",
            "alert_id": "1"
        }
    }))

    context.detail["price_alert"] = json.loads(context.ws.recv())

def createAvailabilityAlert(context):
    context.ws.send(json.dumps({
        "action": "createAlertReq",
        "wishlist_item_id": "1", 
        "alert_item": {
            "entity_type": "ALERT#AVAILABILITY",
            "alert_type": "AVAILABILITY",
            "user_id": "user-123",
            "wishlist_item_id": "1",
            "card_market_id": "1",
            "alert_id": "1"
        }
    }))

    context.detail["availability_alert"] = json.loads(context.ws.recv())

def getWishlist(context):
    context.ws.send(json.dumps({
        "action": "getWishlistReq",
    }))

    context.detail["get_wishlist"] = json.loads(context.ws.recv())


def createWishlistItem(context):
    context.ws.send(json.dumps({
        "action": "createWishlistItemReq",
        "deck_id": "1",
        "wishlist_item": {
            "oracle_id": "1",
            "image_url" : "https//img.png",
            "cardmarket_id": "1",
            "card_name": "Swords of Doom"
        }
    }))

    context.detail["created_wishlist_item"] = json.loads(context.ws.recv())

def getAlerts(context):
    context.ws.send(json.dumps({
        "action": "getAlertsReq",
        "wishlist_item_id": "1"
    }))

    context.detail["get_alerts"] = json.loads(context.ws.recv())

def removePriceAlert(context):
    context.ws.send(json.dumps({
        "action": "removeAlertReq",
        "wishlist_item_id": "1", 
        "alert_item": {
            "entity_type": "ALERT#PRICE",
            "alert_type": "PRICE",
            "price_point": "5.00",
            "wishlist_item_id": "1",
            "card_market_id": "1",
            "alert_id": context.detail["price_alert"]["data"]["alert_id"]
        }
    }))

    context.detail["removed_price_alert"] = json.loads(context.ws.recv())

def removeAvailabilityAlert(context):
    context.ws.send(json.dumps({
        "action": "removeAlertReq",
        "wishlist_item_id": "1", 
        "alert_item": {
            "entity_type": "ALERT#AVAILABILITY",
            "alert_type": "AVAILABILITY",
            "user_id": "user-123",
            "wishlist_item_id": "1",
            "alert_id": context.detail["availability_alert"]["data"]["alert_id"],
            "card_market_id": "1"
        }
    }))

    context.detail["removed_availability_alert"] = json.loads(context.ws.recv())

def removeWishlistItem(context):
    context.ws.send(json.dumps({
        "action": "removeWishlistItemReq",
        "wishlist_item_id": context.detail["created_wishlist_item"]["data"]["wishlist_item_id"]
    }))

    context.detail["removed_wishlist_item"] = json.loads(context.ws.recv())

@given("there is an user and this user is logged in")
def step_impl(context):
    loginAndConnectUser(context)

@when("I request to create a price alert with price point: '{price_point}'")
def step_impl(context, price_point):
    createPriceAlert(context, price_point)

@when("I request to create a availability alert")
def step_impl(context):
    createAvailabilityAlert(context)   

@when("I request for my alerts")
def step_impl(context):
    getAlerts(context)

@when("I request to remove a price alert")
def step_impl(context):
    removePriceAlert(context)

@when("I request to remove a availability alert")
def step_impl(context):
    removeAvailabilityAlert(context)

@when("I add a new card to the wishlist")
def step_impl(context):
    createWishlistItem(context)

@when("I request for my wishlist")
def step_impl(context):
    getWishlist(context)
   
@when("I remove a card from the wishlist")
def step_impl(context):
    removeWishlistItem(context)

@then("a price alert is created")
def step_impl(context):
    assert context.detail["price_alert"]["event_type"] == "INSERT_ALERT#PRICE_RESULT"
    assert context.detail["price_alert"]["data"]["entity_type"] == "ALERT#PRICE"
    assert context.detail["price_alert"]["data"]["price_point"] == "5.00"
    assert context.detail["price_alert"]["data"]["wishlist_item_id"] == "1" 
    assert context.detail["price_alert"]["data"]["card_market_id"] == "1" 

@then("a availability alert is created")
def step_impl(context):
    assert context.detail["availability_alert"]["event_type"] == "INSERT_ALERT#AVAILABILITY_RESULT"
    assert context.detail["availability_alert"]["data"]["entity_type"] == "ALERT#AVAILABILITY"
    assert context.detail["availability_alert"]["data"]["wishlist_item_id"] == "1" 
    assert context.detail["availability_alert"]["data"]["card_market_id"] == "1" 

@then("I should be able to see my alerts")
def step_impl(context):
    assert context.detail["get_alerts"]["event_type"] == "GET_ALERT_RESULT"

    # Price alert
    assert context.detail["get_alerts"]["data"][1]["entity_type"] == "ALERT#PRICE"
    assert context.detail["get_alerts"]["data"][1]["price_point"] == "5.00"
    assert context.detail["get_alerts"]["data"][1]["wishlist_item_id"] == "1"
    assert context.detail["get_alerts"]["data"][1]["card_market_id"] == "1"

    # Availability alert
    assert context.detail["get_alerts"]["data"][0]["entity_type"] == "ALERT#AVAILABILITY"
    assert context.detail["get_alerts"]["data"][0]["wishlist_item_id"] == "1"
    assert context.detail["get_alerts"]["data"][0]["card_market_id"] == "1"

@then("a price alert is removed")
def step_impl(context):
    assert context.detail["removed_price_alert"]["event_type"] == "REMOVE_ALERT#PRICE_RESULT"
    assert context.detail["removed_price_alert"]["data"]["entity_type"] == "ALERT#PRICE"
    assert context.detail["removed_price_alert"]["data"]["price_point"] == "5.00"
    assert context.detail["removed_price_alert"]["data"]["card_market_id"] == "1"
    assert context.detail["removed_price_alert"]["data"]["wishlist_item_id"] == "1"

@then("a availability alert is removed")
def step_impl(context):
    assert context.detail["removed_availability_alert"]["event_type"] == "REMOVE_ALERT#AVAILABILITY_RESULT"
    assert context.detail["removed_availability_alert"]["data"]["entity_type"] == "ALERT#AVAILABILITY"
    assert context.detail["removed_availability_alert"]["data"]["card_market_id"] == "1"
    assert context.detail["removed_availability_alert"]["data"]["wishlist_item_id"] == "1"


@then("the wishlist should contain a new card")
def step_impl(context):
    assert context.detail["created_wishlist_item"]["event_type"] == "INSERT_WISHLIST_ITEM_RESULT"
    assert context.detail["created_wishlist_item"]["data"]["entity_type"] == "WISHLIST_ITEM"
    assert context.detail["created_wishlist_item"]["data"]["card_name"] == "Swords of Doom"
    assert context.detail["created_wishlist_item"]["data"]["card_market_id"] == "1"
    assert context.detail["created_wishlist_item"]["data"]["oracle_id"] == "1"
    assert context.detail["created_wishlist_item"]["data"]["image_url"] == "https//img.png"

@then("I should be able to see my wishlist")
def step_impl(context):
    assert context.detail["get_wishlist"]["event_type"] == "GET_WISHLIST_RESULT"
    assert context.detail["get_wishlist"]["data"][0]["entity_type"] == "WISHLIST_ITEM"
    assert context.detail["get_wishlist"]["data"][0]["card_name"] == "Swords of Doom"
    assert context.detail["get_wishlist"]["data"][0]["card_market_id"] == "1"
    assert context.detail["get_wishlist"]["data"][0]["oracle_id"] == "1"
    assert context.detail["get_wishlist"]["data"][0]["image_url"] == "https//img.png"

@then("the wishlist item should be removed from the wishlist")
def step_impl(context):
    assert context.detail["removed_wishlist_item"]["event_type"] == "REMOVE_WISHLIST_ITEM_RESULT"
    assert context.detail["removed_wishlist_item"]["data"]["oracle_id"] == "1"
    assert context.detail["removed_wishlist_item"]["data"]["image_url"] == "https//img.png"
    assert context.detail["removed_wishlist_item"]["data"]["entity_type"] == "WISHLIST_ITEM"
    assert context.detail["removed_wishlist_item"]["data"]["card_name"] == "Swords of Doom"
    assert context.detail["removed_wishlist_item"]["data"]["card_market_id"] == "1"
