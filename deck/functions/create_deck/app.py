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
    deck_id = str(uuid.uuid4())
    body = json.loads(event["body"])
    user_id = event["requestContext"]["authorizer"]["userId"]

    now = datetime.utcnow().isoformat()
    deck_name = body["deck_name"]
    deck_type = body["deck_type"]

    logger.info("Creating new deck with id: %s", deck_id)

    table.put_item(Item={
        "PK": f"USER#{user_id}",
        "SK": f"DECK#{deck_id}",
        "entity_type": "DECK",
        "created_at": now,
        "last_modified": now,
        "deck_id": deck_id,
        "deck_name": deck_name,
        "deck_type": deck_type,
        "user_id": user_id,
        "GSI1_PK": f"DECK#{deck_id}",
        "GSI1_SK": f"USER#{user_id}",
        "total_value": {
            "usd": 0,
            "usd_foil": 0,
            "usd_etched": 0,
            "eur": 0,
            "eur_foil": 0,
            "tix": 0
        },
        "is_valid": True
    })

    return {"statusCode": 200}
