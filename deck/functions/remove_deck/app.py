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
    """Extract inventory ID and card ID"""
    body = json.loads(event["body"])
    logger.info(f"Received body {body}")
    deck_id = body["deck_id"]
    user_id = event["requestContext"]["authorizer"]["userId"]

    try:
        logger.info("Removing deck from DynamoDB table")
        result = table.delete_item(
            Key={
                "PK": f"USER#{user_id}",
                "SK": f"DECK#{deck_id}"
            },
            ReturnValues="ALL_OLD"
        )
        logger.info(f"Deleted deck from table, result is {result}")

    except Exception as error:
        logger.info("Error deleting deck from database: %s", error)

    return {
        "statusCode": 200,
    }
