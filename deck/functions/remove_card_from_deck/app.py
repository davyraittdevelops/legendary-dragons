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

  user_id = event["requestContext"]["authorizer"]["userId"]
  deck_id = body["deck_id"]
  deck_card = body["deck_card"]

  pk = f"USER#{user_id}"
  sk = f"DECK#{deck_id}#DECK_CARD#{deck_card['inventory_card_id']}"
    
  try:
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