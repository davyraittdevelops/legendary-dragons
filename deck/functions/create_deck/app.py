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
    deck = str(uuid.uuid4())
    body = json.loads(event["body"])
    print(event)
    user_id = event["requestContext"]["authorizer"]["userId"]

    now = datetime.utcnow().isoformat()
    deck_name = body["deck_name"]
    deck_type = body["deck_type"]

    logger.info("Creating new deck with id: %s", deck)

    table.put_item(Item={
        "PK": "DECK#" + deck,
        "SK": "USER#" + user_id,
        "entity_type": "DECK",
        "created_at": now,
        "last_modified": now,
        "deck_id": deck,
        "deck_name": deck_name,
        "deck_type": deck_type,
        "user_id": user_id,
        "GSI1_PK": "USER#" + user_id,
        "GSI1_SK": "DECK#" + deck,
        "total_value": "0"
    })

    return {"statusCode": 200}
