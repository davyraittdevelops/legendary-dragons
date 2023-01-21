import json
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
  logger.info(f'inventory {inventory_card}')

  try:
    result = table.put_item(Item=inventory_card,
      ConditionExpression='attribute_exists(PK) AND attribute_exists(SK)'
    )
    logger.info(f'result from put item {result}')
  except dynamodb.meta.client.exceptions.ConditionalCheckFailedException as e:
    error = extract_error_message(e)
    logger.info(f"Registration failed: {error}")
    return {
      "statusCode": 400,
      "body": json.dumps({"message": error.strip()})
    }

  return {"statusCode": 200}


def extract_error_message(error):
  return str(error)[str(error).index(":") + 1:len(str(error))]
