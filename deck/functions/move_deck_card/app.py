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
  sk = body["sk"]
  pk = "USER#" + event["requestContext"]["authorizer"]["userId"]

  save = table.get_item(
    Key={
      "PK": pk,
      "SK": sk
    }
  )["Item"]

  logger.info(f"Saved info before move: {save}")

  entity_type = "SIDE_DECK_CARD"
  if save["entity_type"] == entity_type:
    entity_type = "DECK_CARD"

  logger.info(sk)
  delete = table.delete_item(
    Key={
      "PK": pk,
      "SK": sk
    },
    ReturnValues='ALL_OLD'
  )
  logger.info("Succesfully deleted card from deck: ", delete)

  table.put_item(Item={
      "PK": pk,
      "SK": sk,
      "entity_type": entity_type,
      "deck_id": save["deck_id"],
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
      "GSI1_SK": pk,
      "user_id": save["user_id"]
    })
  logger.info(f"Succesfully moved to other deck, deck id now: {sk}")
  return {"statusCode": 200}