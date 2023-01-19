import json
import logging
import os
import boto3
import uuid
from datetime import datetime
from aws_xray_sdk.core import patch_all
from boto3.dynamodb.conditions import Key

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
    user_id = event["requestContext"]["authorizer"]["userId"]

    """Do query/data manipulation.  """
    try:
        wishlist_items = table.query(
            KeyConditionExpression=Key("GSI1_PK").eq(f"WISHLIST#USER#{user_id}") 
            &
            Key("GSI1_SK").begins_with("WISHLIST_ITEM#"),
            IndexName="GSI1"
        )['Items']
        logger.info(f'Result from table get item : {wishlist_items}')
    except Exception as error:
        logger.info(f'Received an error: {error}')

    """Post output back to the connection."""
    output = {
        "event_type": "GET_WISHLIST_ITEM_RESULT",
        "wishlist_item": wishlist_items,
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