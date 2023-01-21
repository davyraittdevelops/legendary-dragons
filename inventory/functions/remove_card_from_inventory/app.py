import json
import logging
import os
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
    except Exception as error:
        logger.info('Error deleting card from database: %s', error)

    return {"statusCode": 200}
