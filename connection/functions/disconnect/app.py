import logging
import os
import boto3
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.environ["TABLE_NAME"])


def lambda_handler(event, context):
    try:
        connection_id = event["requestContext"]["connectionId"]
        user_id = event["requestContext"]["authorizer"]["userId"]

        table.delete_item(
            Key={
                "PK": "CONNECTION#" + connection_id,
                "SK": "USER#" + user_id
            },
            ReturnValues='ALL_OLD'
        )

        logger.info('Succesfully removed connection from database.')
    except Exception as error:
        logger.error('Error: %s', error)

    return {"statusCode": 200, "body": "Disconnected."}
