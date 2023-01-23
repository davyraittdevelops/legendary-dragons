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
  body = json.loads(event["body"])
  deck_card = body["deck_card"]
  deck_id = body["deck_id"]
  deck_type = body["deck_type"]

  pk = "USER#" + event["requestContext"]["authorizer"]["userId"]
  sk = "DECK#" + deck_id + "#DECK_CARD#" + deck_card
  entity_type = "DECK_CARD"
  if deck_type == "side_deck":
    entity_type = "SIDE_DECK_CARD"

  try:
    table.update_item(
      Key = {
        "PK": pk,
        "SK": sk
      },
      UpdateExpression = "set entity_type=:e",
      ExpressionAttributeValues={
        ":e": entity_type
      }
    )
    logger.info("Card has been moved!")
  except Exception as e:
    logger.info(f"Moving card has failed: {e}")
  return {"statusCode": 200}