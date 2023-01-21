import json
import logging
import os
import boto3
import uuid
from datetime import datetime
from aws_xray_sdk.core import patch_all
from decimal import Decimal

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))


def lambda_handler(event, context):
    print('event ' , event)

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
    alert =  body['alert']
    alert_id = alert['alert_id']
    alert_type = alert['entity_type']
    
    print('We received object ' , alert) , wishlist_item_id

    """Do query/data manipulation."""
    try:
        if alert_type ==  'ALERT#PRICE':
            response = table.delete_item(
                Key={
                    "PK": f'USER#{user_id}',
                    "SK": f"WISHLIST_ITEM#{wishlist_item_id}#ALERT#PRICE#{alert_id}"
                }
            )
            logger.info(f'Result from table delete item : {response}')

        if alert_type ==  'ALERT#AVAILABILITY':
            response = table.delete_item(
                Key={
                    "PK": f'USER#{user_id}',
                    "SK": f"WISHLIST_ITEM#{wishlist_item_id}#ALERT#AVAILABILITY#{alert_id}"
                }
            )
            logger.info(f'Result from table remove item : {response}')
            
    except Exception as error:
        logger.info(f'Received an error: {error}')

    """Post output back to the connection."""
    output = {
        "event_type": "REMOVE_ALERT_RESULT",
        "data": response,
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