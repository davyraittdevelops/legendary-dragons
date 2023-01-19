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