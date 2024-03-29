import json
import logging
import os
from decimal import Decimal
from datetime import datetime

import boto3
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
  patch_all()

dynamodb = boto3.resource("dynamodb")
events_client = boto3.client("events")
table = dynamodb.Table(os.getenv("TABLE_NAME"))
eventbus = os.getenv("EVENT_BUS_NAME")

def lambda_handler(event, context):
  """Creates a new Deck_Card entry"""
  body = json.loads(event["body"])

  user_id = event["requestContext"]["authorizer"]["userId"]
  inventory_id = body["inventory_id"]
  deck_id = body["deck_id"]
  deck_card = body["deck_card"]

  pk = f"USER#{user_id}"
  sk = f"DECK#{deck_id}#DECK_CARD#{deck_card['inventory_card_id']}"
    
  try:
    update_deck_total_value(user_id, deck_id, deck_card["prices"])
    update_inventory_card_deck_location(user_id, inventory_id, deck_card['inventory_card_id'])
    logger.info("Removing card from deck")
    result = table.delete_item(
      Key={
        "PK": pk,
        "SK": sk
      },
      ReturnValues="ALL_OLD"
    )
    logger.info(f"Deleted {deck_card['card_name']} from {sk}, result: {result}")
  except Exception as error:
    logger.info(f"Error deleting card from deck, {error}")
  return {"statusCode": 200}

def update_inventory_card_deck_location(user_id, inventory_id, inventory_card_id):
  events_client.put_events(Entries=[
    {
      "Time": datetime.now(),
      "Source": "legdragons.decks.remove_card_from_deck",
      "DetailType": "CARD_REMOVED_FROM_DECK",
      "Detail": json.dumps({
        "user_id": user_id,
        "inventory_id": inventory_id,
        "inventory_card_id": inventory_card_id,
        "fields": {
          "deck_location": ""
        }
      }),
      "EventBusName": eventbus
    }
  ])

def update_deck_total_value(user_id, deck_id, inventory_card_prices):
  pk = "USER#" + user_id
  sk = "DECK#" + deck_id
  deck = table.get_item(
      Key={
        "PK": pk,
        "SK": sk
      }
  )["Item"]

  deck_total_values = dict(sorted(deck["total_value"].items()))
  inventory_card_prices = dict(sorted(inventory_card_prices.items()))

  new_total_values = {}
  for (key, value), (key2, value2) in zip(deck_total_values.items(), inventory_card_prices.items()):
    new_value = value - Decimal(value2.replace(',','.')) if value2 else value
    new_total_values[key] = new_value if new_value >= 0 else 0

  table.update_item(
      Key={
        "PK": pk,
        "SK": sk
      },
      ConditionExpression='attribute_exists(PK) AND attribute_exists(SK)',
      UpdateExpression='set total_value = :new_total_values',
      ExpressionAttributeValues={
        ":new_total_values": new_total_values
      }
  )
