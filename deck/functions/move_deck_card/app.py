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
  )

  logger.info(save)
  return {"statusCode": 200}