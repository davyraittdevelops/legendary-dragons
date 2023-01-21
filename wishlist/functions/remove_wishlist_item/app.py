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
    """Read neccesary information from the body/event."""
    connection_id = event["requestContext"]["connectionId"]
    domain_name = event["requestContext"]["domainName"]
    stage = event["requestContext"]["stage"]
    endpoint = f"https://{domain_name}/{stage}"
    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)
    body = json.loads(event["body"])
    user_id = event["requestContext"]["authorizer"]["userId"]

    """Params from body."""
    wishlist_item_id = body['wishlist_item_id']

    """Do query/data manipulation."""
    try:
        response = table.delete_item(
            Key={
                "PK": f'USER#{user_id}',
                "SK": f"WISHLIST#{wishlist_item_id}"
            }
            )
        logger.info(f'Result from table delete item : {response}')

    except Exception as error:
        logger.info(f'Received an error: {error}')

    """Post output back to the connection."""
    output = {
        "event_type": "REMOVE_WISHLIST_ITEM_RESULT",
        "data": wishlist_item_id,
    }

    apigateway.post_to_connection(
        ConnectionId=connection_id,
        Data=json.dumps(output, cls=DecimalEncoder)
    )
    return {"statusCode": 200}

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)

        return json.JSONEncoder.default(self, obj)