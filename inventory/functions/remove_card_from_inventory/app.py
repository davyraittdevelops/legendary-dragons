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

    logger.info(f"Removing inventory card from DynamoDB table")
    table = dynamodb.Table("inventories")

    try:
        table.delete_item(
        Key={
            "PK": 'INVENTORY_CARD#' + 'aa0054af-96a0-4246-a4fb-92b92c171492',
            "SK": 'INVENTORY#' + 'd305e5e8-763d-4c6f-83be-7e5eb39bd2f9'
        },
        ReturnValues='ALL_OLD'
    )
        print('Card with ID ' + 'aa0054af-96a0-4246-a4fb-92b92c171492' + ' has been deleted.')
    except Exception as error:
        print(error)
        print('Error deleting card with ID ' + 'd305e5e8-763d-4c6f-83be-7e5eb39bd2f9')

    # user_id = event["requestContext"]["authorizer"]["userId"]
    # inventory_id = body["inventory_id"]
    # card_id = str(uuid.uuid4())
    # card = body["inventory_card"]
    # now = datetime.utcnow().isoformat()
    # pk = f"INVENTORY_CARD#{card_id}"
    # sk = f"INVENTORY#{inventory_id}"


   
    return {"statusCode": 200}
