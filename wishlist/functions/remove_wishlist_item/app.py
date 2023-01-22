from decimal import Decimal
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
    """Remove wishlist item for given ID."""
    body = json.loads(event["body"])
    user_id = event["requestContext"]["authorizer"]["userId"]
    wishlist_item_id = body['wishlist_item_id']

    try:
        response = table.delete_item(
            Key={
                "PK": f'USER#{user_id}',
                "SK": f"WISHLIST_ITEM#{wishlist_item_id}"
            }
            )
        logger.info(f'Result from table delete item : {response}')

    except Exception as error:
        logger.info(f'Received an error: {error}')

    return {"statusCode": 200}

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)

        return json.JSONEncoder.default(self, obj)