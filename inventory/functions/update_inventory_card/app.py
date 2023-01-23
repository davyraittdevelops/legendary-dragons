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
  event_detail = event["detail"]
  user_id = event_detail["user_id"]
  inventory_id = event_detail["inventory_id"]
  inventory_card_id = event_detail["inventory_card_id"]
  new_field_values = event_detail["fields"]

  pk = "USER#" + user_id
  sk = "INVENTORY#" + inventory_id + "#INVENTORY_CARD#" + inventory_card_id

  expression = generate_update_query(new_field_values)

  try:
    result = table.update_item(
      Key={
        "PK": pk,
        "SK": sk
      },
      ConditionExpression='attribute_exists(PK) AND attribute_exists(SK)',
      UpdateExpression=expression["UpdateExpression"],
      ExpressionAttributeNames=expression["ExpressionAttributeNames"],
      ExpressionAttributeValues=expression["ExpressionAttributeValues"]
    )
    logger.info(f'result from update item {result}')
  except dynamodb.meta.client.exceptions.ConditionalCheckFailedException as e:
    error = extract_error_message(e)
    logger.info(f"Update inventory card failed: {error}")
    return {
      "statusCode": 400,
      "body": json.dumps({"message": error.strip()})
    }

  return {"statusCode": 200}

def generate_update_query(fields):
  expression = {
    "UpdateExpression": 'set',
    "ExpressionAttributeNames": {},
    "ExpressionAttributeValues": {}
  }
  for field, value in fields.items():
    expression["UpdateExpression"] += f" #{field} = :{field},"
    expression["ExpressionAttributeNames"][f"#{field}"] = field
    expression["ExpressionAttributeValues"][f":{field}"] = value
  expression["UpdateExpression"] = expression["UpdateExpression"][:-1]

  return expression

def extract_error_message(error):
  return str(error)[str(error).index(":") + 1:len(str(error))]
