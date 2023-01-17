import logging
import os

import boto3
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
  patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))

def lambda_handler(event, context):
  """Updates Inventory Card entry"""
  inventory_card = event["detail"]["inventory_card"]

  table.put_item(Item=inventory_card)

  return {"statusCode": 200}
