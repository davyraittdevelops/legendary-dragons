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
table = dynamodb.Table(os.getenv("TABLE_NAME"))


def lambda_handler(event, context):
    """Create a new Inventory entry after account confirmation."""
    body = json.loads(event["body"])

    user_id = event["requestContext"]["authorizer"]["userId"]
    inventory_id = extract_inventory_id(body["inventory_id"], user_id)
    card_id = str(uuid.uuid4())
    card = body["inventory_card"]

    now = datetime.utcnow().isoformat()
    pk = f"INVENTORY_CARD#{card_id}"
    sk = f"INVENTORY#{inventory_id}"

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
        "GSI1_PK": sk,
        "GSI1_SK": pk
    })

    return {"statusCode": 200}


def extract_inventory_id(inventory_id, user_id):
    """Create a new inventory when an inventory ID is not provided."""
    if inventory_id is None:
        inventory_id = str(uuid.uuid4())
        logger.info("Creating new inventory with id: %s", inventory_id)

        now = datetime.utcnow().isoformat()
        pk = f"INVENTORY#{inventory_id}"
        sk = f"USER#{user_id}"

        table.put_item(Item={
            "PK": pk,
            "SK": sk,
            "entity_type": "INVENTORY",
            "inventory_id": inventory_id,
            "user_id": user_id,
            "created_at": now,
            "last_modified": now,
            "total_value": 0,
            "GSI1_PK": sk,
            "GSI1_SK": pk
        })

    return inventory_id
