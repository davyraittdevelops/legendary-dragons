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

  save = table.get_item(
    Key={
      "PK": deck_card,
      "SK": deck_id
    }
  )["Item"]

  logger.info(f"Saved info before move: {save}")

  sk = save["SK"] + "#SIDE_DECK"
  logger.info(sk)
  if "#SIDE_DECK" in save["SK"]:
    sk = "DECK#" + save["deck_id"]

  logger.info(sk)
  delete = table.delete_item(
    Key={
      "PK": deck_card,
      "SK": deck_id
    },
    ReturnValues='ALL_OLD'
  )
  logger.info("Succesfully deleted card from deck: ", delete)

  table.put_item(Item={
      "PK": deck_card,
      "SK": sk,
      "entity_type": "DECK_CARD",
      "deck_id": deck_id,
      "inventory_id": save["inventory_id"],
      "inventory_card_id": save["inventory_card_id"],
      "created_at": save["created_at"],
      "last_modified": save["last_modified"],
      "card_name": save["card_name"],
      "colors": save["colors"],
      "prices": save["prices"],
      "rarity": save["rarity"],
      "quality": save["quality"],
      "image_url": save["image_url"],
      "GSI1_PK": sk,
      "GSI1_SK": deck_card,
      "user_id": save["user_id"]
    })
  logger.info("Succesfully moved to other deck, deck id now: ", )

  # TODO: Access denied exception to delete!
  return {"statusCode": 200}