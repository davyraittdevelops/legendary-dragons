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
    user_id = event["detail"]["user_id"]
    inventory_id = str(uuid.uuid4())

    now = datetime.utcnow().isoformat()

    logger.info("Creating new inventory with id: %s", inventory_id)
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
        "total_value": "0",
        "GSI1_PK": sk,
        "GSI1_SK": pk
    })

    return {"statusCode": 200}
