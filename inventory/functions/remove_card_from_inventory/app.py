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


def lambda_handler(event, context):
    """Extract inventory ID and card ID"""
    body = json.loads(event["body"])

    logger.info(f"Received body {body}")

    # user_id = event["requestContext"]["authorizer"]["userId"]
    # inventory_id = body["inventory_id"]
    # card_id = str(uuid.uuid4())
    # card = body["inventory_card"]
    # now = datetime.utcnow().isoformat()
    # pk = f"INVENTORY_CARD#{card_id}"
    # sk = f"INVENTORY#{inventory_id}"

    logger.info(f"Removing inventory card from DynamoDB table")

   
    return {"statusCode": 200}
