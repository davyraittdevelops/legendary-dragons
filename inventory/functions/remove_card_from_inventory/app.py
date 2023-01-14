import json
import logging
import os
import boto3
import uuid
from datetime import datetime
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")


def lambda_handler(event, context):
    """Extract inventory ID and card ID"""
    body = json.loads(event["body"])
    logger.info(f"Received body {body}")

    inventory_card_id = body['inventory_card_id']
    inventory_id = body['inventory_id']

    logger.info(f"Removing inventory card from DynamoDB table")

    try:
        table = dynamodb.Table("inventories")
        result = table.delete_item(
        Key={
            "PK": 'INVENTORY_CARD#' + inventory_card_id,
            "SK": 'INVENTORY#' + inventory_id
        },
        ReturnValues='ALL_OLD'
    )
        logger.info(f"Deleted card from table, result is  {result}")
        
    except Exception as error:
        print(error)
        print('Error deleting card with ID ' + 'd305e5e8-763d-4c6f-83be-7e5eb39bd2f9')
   
    return {
        "statusCode": 200,
        }
