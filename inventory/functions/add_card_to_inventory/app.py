import json
import logging
import os
from decimal import Decimal

import boto3
import uuid
from datetime import datetime
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))


def lambda_handler(event, context):
    """Create a new Inventory entry after account confirmation."""
    body = json.loads(event["body"])

    user_id = event["requestContext"]["authorizer"]["userId"]
    inventory_id = body["inventory_id"]
    card_id = str(uuid.uuid4())
    card = body["inventory_card"]
    card_name_lowercase = card['card_name'].lower().strip()

    now = datetime.utcnow().isoformat()
    pk = f"USER#{user_id}"
    sk = f"INVENTORY#{inventory_id}#INVENTORY_CARD#{card_id}"

    try:
        update_inventory_total_value(user_id, inventory_id, card["prices"])

        logger.info(f"Adding inventory card ({inventory_id}) to DynamoDB table")

        table.put_item(Item={
            "PK": pk,
            "SK": sk,
            "entity_type": "INVENTORY_CARD",
            "inventory_id": inventory_id,
            "user_id": user_id,
            "card_id": card_id,
            "created_at": now,
            "last_modified": now,
            **card,
            "GSI1_PK": pk,
            "GSI1_SK": f"INVENTORY_CARD#{card_name_lowercase}"
        })
        logger.info(f"Succesfully added into inventory: ({sk})")
    except Exception as e:
        logger.info(f"Adding card to inventory failed: {e}")

    return {"statusCode": 200}

def update_inventory_total_value(user_id, inventory_id, card_prices):
    inventory = table.get_item(
        Key={
            "PK": f"USER#{user_id}",
            "SK": f"INVENTORY#{inventory_id}"
        }
    )["Item"]

    inventory_total_values = dict(sorted(inventory["total_value"].items()))
    inventory_total_cards = int(inventory["total_cards"]) + 1
    card_prices = dict(sorted(card_prices.items()))

    new_total_values = {}
    for (key, value), (key2, value2) in zip(inventory_total_values.items(), card_prices.items()):
        new_total_values[key] = value + Decimal(value2.replace(',','.')) if value2 else value

    table.update_item(
        Key={
            "PK": f"USER#{user_id}",
            "SK": f"INVENTORY#{inventory_id}"
        },
        UpdateExpression='set total_value = :new_total_values, total_cards = :new_total_cards',
        ExpressionAttributeValues={
            ":new_total_values": new_total_values,
            ":new_total_cards": str(inventory_total_cards)
        },
        ConditionExpression='attribute_exists(PK) AND attribute_exists(SK)',
    )
