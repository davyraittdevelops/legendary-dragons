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
    """Get a inventory entry for a specific user."""
    logger.info(event)
    body = json.loads(event["body"])

    # TODO: Check how to retrieve user id
    inventory_id = body["inventory_id"]
    user_id = body["user_id"]

    inventory = table.get_item(
        Key={
            "PK": f"INVENTORY#{inventory_id}",
            "SK": f"USER#{user_id}"
        }
    )

    if "Item" not in inventory:
        logger.info(f"Inventory with id = {inventory_id} not found")
        return {"statusCode": 400}

    inventory_cards = table.query(
        KeyConditionExpression=Key("GSI1_PK").eq(f"INVENTORY#{inventory_id}") &
        Key("GSI1_SK").begins_with("INVENTORY_CARD"),
        IndexName="GSI1"
    )["Items"]

    logger.info(f"Found {len(inventory_cards)} inventory cards")
    inventory["Item"]["inventory_cards"] = inventory_cards

    return {
        "statusCode": 200,
        "event_type": "GET_INVENTORY_RESULT",
        "data": inventory["Item"]
    }
