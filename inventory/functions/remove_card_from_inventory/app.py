import json
import logging
import os
import boto3
from boto3.dynamodb.conditions import Key
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))


def lambda_handler(event, context):
    card_id = event["requestContext"]["card_id"]
    inventory = event["body"]["inventory_id"]

    try:
        table.delete_item(
            Key={
                "PK": "INVENTORY_CARD#" + card_id,
                "SK": "INVENTORY#" + inventory
            },
            ReturnValues='ALL_OLD'
        )
        logger.info('Succesfully removed card from inventory :D')
    except Exception as error:
        logger.error('Error: %s', error)

    return {"statusCode": 200}
