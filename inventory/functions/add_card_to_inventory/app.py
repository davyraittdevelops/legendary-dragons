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
    inventory_id = body["inventory_id"]
    card_id = str(uuid.uuid4())
    card = body["inventory_card"]
    card_name_lowercase = card['card_name'].lower().strip()

    now = datetime.utcnow().isoformat()
    pk = f"USER#{user_id}"
    sk = f"INVENTORY#{inventory_id}#INVENTORY_CARD#{card_id}"

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

    return {"statusCode": 200}
