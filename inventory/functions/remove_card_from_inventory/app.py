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
    body = json.loads(event["body"])
    card_id = body["card_id"]
    inventory = body["inventory_id"]
    # Todo: retrieve user id
    # user = body["user_id"]
    try:
        logger.info("Trying to remove from card ")
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
