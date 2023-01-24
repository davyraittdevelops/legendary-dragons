import json
import logging
import os

from datetime import datetime
from decimal import Decimal

import boto3
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
  patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))
eventbus = os.getenv("EVENT_BUS_NAME")
events_client = boto3.client("events")

def lambda_handler(event, context):
  """Creates a new Deck_Card entry"""
  body = json.loads(event["body"])

  deck_type = body["deck_type"]
  user_id = event["requestContext"]["authorizer"]["userId"]
  deck_id = body["deck_id"]
  inventory_card = body["inventory_card"]
  deck_name = body["deck_name"]
  now = datetime.utcnow().isoformat()
  pk = f"USER#{user_id}"
  sk = f"DECK#{deck_id}#DECK_CARD#{inventory_card['card_id']}"
  entity_type = "DECK_CARD"

  if deck_type == "side_deck":
    entity_type = "SIDE_DECK_CARD"

  try:
    update_deck_total_value(user_id, deck_id, inventory_card["prices"])

    update_inventory_card_deck_location(user_id, inventory_card['inventory_id'], inventory_card['card_id'], deck_name)

    logger.info(f"Adding deck card ({inventory_card['card_id']}) to DynamoDB table")

    table.put_item(Item={
      "PK": pk,
      "SK": sk,
      "entity_type": entity_type,
      "deck_id": deck_id,
      "inventory_id": inventory_card["inventory_id"],
      "inventory_card_id": inventory_card["card_id"],
      "created_at": now,
      "last_modified": now,
      "card_name": inventory_card["card_name"],
      "colors": inventory_card["colors"],
      "prices": inventory_card["prices"],
      "rarity": inventory_card["rarity"],
      "quality": inventory_card["quality"],
      "image_url": inventory_card["image_url"],
      "GSI1_PK": sk,
      "GSI1_SK": pk,
      "user_id": user_id
    })
    logger.info(f"Succesfully added into deck: ({sk})")
  except Exception as e:
    logger.info(f"Adding card to deck failed: {e}")

  return {"statusCode": 200}


def update_inventory_card_deck_location(user_id, inventory_id, inventory_card_id, deck_location):
  events_client.put_events(Entries=[
    {
      "Time": datetime.now(),
      "Source": "legdragons.decks.add_card_to_deck",
      "DetailType": "CARD_ADDED_TO_DECK",
      "Detail": json.dumps({
        "user_id": user_id,
        "inventory_id": inventory_id,
        "inventory_card_id": inventory_card_id,
        "fields": {
          "deck_location": deck_location
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
    new_total_values[key] = value + Decimal(value2.replace(',','.')) if value2 else value

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
