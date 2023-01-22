import json
import logging
import os
import boto3
from aws_xray_sdk.core import patch_all
from boto3.dynamodb.conditions import Key
from decimal import Decimal


logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))

def lambda_handler(event, context):
    """Get alerts for user."""
    connection_id = event["requestContext"]["connectionId"]
    domain_name = event["requestContext"]["domainName"]
    stage = event["requestContext"]["stage"]
    endpoint = f"https://{domain_name}/{stage}"
    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)
    user_id = event["requestContext"]["authorizer"]["userId"]
    body = json.loads(event["body"])
    wishlist_item_id = body['wishlist_item_id']

    try:
        logger.info(f'Querying with the following wishlist_item_id {wishlist_item_id}')
        alert_items = table.query(
            KeyConditionExpression=Key("PK").eq(f"USER#{user_id}") 
            &
            Key("SK").begins_with(f"WISHLIST_ITEM#{wishlist_item_id}#ALERT#")
        )['Items']
        logger.info(f'Result from table get item : {alert_items}')
    except Exception as error:
        logger.info(f'Received an error: {error}')

    output = {
        "event_type": "GET_ALERT_RESULT",
        "data": alert_items,
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