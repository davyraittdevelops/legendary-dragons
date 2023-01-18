import json
import logging
import os
import uuid

import boto3
from datetime import datetime
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
  deck_id = body["deck_id"]
  inventory_card = body["inventory_card"]
  deck_card_id = str(uuid.uuid4())

  now = datetime.utcnow().isoformat()
  pk = f"DECK_CARD#{deck_card_id}"
  sk = f"DECK#{deck_id}"

  try:
    update_inventory_card_deck_location(inventory_card)

    logger.info(f"Adding deck card ({deck_card_id}) to DynamoDB table")

    table.put_item(Item={
      "PK": pk,
      "SK": sk,
      "entity_type": "DECK_CARD",
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
      "GSI1_SK": pk
    })
  except Exception as e:
    logger.info(f"Adding card to deck failed: {e}")

  return {"statusCode": 200}


def update_inventory_card_deck_location(inventory_card):
  events_client.put_events(Entries=[
    {
      "Time": datetime.now(),
      "Source": "legdragons.deck.add_card_to_deck",
      "DetailType": "CARD_ADDED_TO_DECK",
      "Detail": json.dumps({"inventory_card": inventory_card}),
      "EventBusName": eventbus
    }
  ])
