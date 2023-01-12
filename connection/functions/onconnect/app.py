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
        domain = event["requestContext"]["domainName"]
        stage = event["requestContext"]["stage"]

        user_id = event["requestContext"]["authorizer"]["userId"]
        logger.info("Adding connection with id = %s", connection_id)

        table.put_item(
            Item={
                "PK": "CONNECTION#" + connection_id,
                "SK": "USER#" + user_id,
                "entity_type": "CONNECTION",
                "domain": domain,
                "stage": stage,
                "connection_id": connection_id,
                "user_id": user_id,
                "GSI1_PK": "USER#" + user_id,
                "GSI1_SK": "CONNECTION#" + connection_id
            }
        )

        logger.info("Succesfully added connection to database.")
    except Exception as error:
        logger.error("Error: %s", error)

    return {"statusCode": 200, "body": "Connected."}
