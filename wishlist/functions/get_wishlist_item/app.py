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
    
    wishlist_item = body['wishlist_item']
    wishlist_item_id = str(uuid.uuid4())

    # wishlist_item = {
    #     'PK': f'WISHLIST_ITEM#{wishlist_item_id}',
    #     'SK': 'WISHLIST#USER#15fcbfd3-0c91-48d1-8257-634e8411eed9',
    #     'wishlist_item_id' : wishlist_item_id,
    #     'entity_type': 'WISHLIST_ITEM',
    #     'created_at': '1/19/2023',
    #     'oracle_id': '36f9af75-9c95-4503-95e8-8f524c39a334',
    #     'price_point': '€5.00',
    #     'card_name': 'White Lotus',
    #     'user_id': '15fcbfd3-0c91-48d1-8257-634e8411eed9',
    #     'GSI1_PK': 'WISHLIST#15fcbfd3-0c91-48d1-8257-634e8411eed9',
    #     'GSI1_SK': f'WISHLIST_ITEM#{wishlist_item_id}',
    #     'GSI2_PK': 'DECK#0000-0000-0000-0000',
    #     'GSI2_SK':  f'WISHLIST_ITEM#{wishlist_item_id}',
    # }

    """Do query/data manipulation."""
    try:
        response = table.put_item(
            Item=wishlist_item
        )
        logger.info(f'Result from table put item : {response}')
    except Exception as error:
        logger.info(f'Received an error: {error}')

    """Post output back to the connection."""
    output = {
        "event_type": "CREATE_WISHLIST_ITEM_RESULT",
        "wishlist_item": wishlist_item,
       
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