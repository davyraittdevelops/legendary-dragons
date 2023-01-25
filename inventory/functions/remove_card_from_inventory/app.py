import json
import logging
import os
from decimal import Decimal

import boto3
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))


def lambda_handler(event, context):
    """Extract inventory ID and card ID."""
    body = json.loads(event["body"])
    logger.info(f"Received body {body}")
    inventory_card_id = body['inventory_card_id']
    inventory_id = body['inventory_id']
    user_id = event["requestContext"]["authorizer"]["userId"]

    try:
        logger.info("Removing inventory card from DynamoDB table")
        result = table.delete_item(
            Key={
                "PK": f"USER#{user_id}",
                "SK": f"INVENTORY#{inventory_id}#INVENTORY_CARD#{inventory_card_id}"
            },
            ReturnValues='ALL_OLD'
        )

        logger.info(f"Deleted card from table, result is {result}")

        update_inventory_total_value(user_id, inventory_id, result["Attributes"]["prices"])
    except Exception as e:
        logger.info(f"Error deleting card from database: {e}")

    return {"statusCode": 200}

def update_inventory_total_value(user_id, inventory_id, card_prices):
    pk = "USER#" + user_id
    sk = "INVENTORY#" + inventory_id
    inventory = table.get_item(
        Key={
            "PK": pk,
            "SK": sk
        }
    )["Item"]

    inventory_total_values = dict(sorted(inventory["total_value"].items()))
    inventory_total_cards = int(inventory["total_cards"]) - 1
    card_prices = dict(sorted(card_prices.items()))

    new_total_values = {}
    for (key, value), (key2, value2) in zip(inventory_total_values.items(), card_prices.items()):
        new_value = value - Decimal(value2.replace(',','.')) if value2 else value
        new_total_values[key] = new_value if new_value >= 0 else 0

    table.update_item(
        Key={
            "PK": pk,
            "SK": sk
        },
        ConditionExpression='attribute_exists(PK) AND attribute_exists(SK)',
        UpdateExpression='set total_value = :new_total_values, total_cards = :new_total_cards',
        ExpressionAttributeValues={
            ":new_total_values": new_total_values,
            ":new_total_cards": str(inventory_total_cards)
        }
    )
