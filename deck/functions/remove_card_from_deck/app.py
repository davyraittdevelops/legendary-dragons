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

  deck_type = body["deck_type"]
  deck_id = body["deck_id"]
  inventory_card = body["inventory_card"]

  pk = f"DECK_CARD#{inventory_card['card_id']}"
  sk = f"DECK#{deck_id}"

  if deck_type == "side_deck": 
    sk = f"DECK#{deck_id}#SIDE_DECK"

  try:
    logger.info("Removing card from deck")
    result = table.delete_item(
      Key={
        "PK": pk,
        "SK": sk
      },
      ReturnValues="ALL_OLD"
    )
    logger.info(f"Deleted {inventory_card['card_name']} from {sk}, result: {result}")
  except Exception as error:
    logger.info(f"Error deleting card from deck, {error}")
  return {"statusCode": 200}