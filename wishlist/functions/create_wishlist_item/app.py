from decimal import Decimal
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

"""Create wishlist item"""
def lambda_handler(event, context):
    connection_id = event["requestContext"]["connectionId"]
    domain_name = event["requestContext"]["domainName"]
    stage = event["requestContext"]["stage"]
    endpoint = f"https://{domain_name}/{stage}"
    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)
    body = json.loads(event["body"])
    user_id = event["requestContext"]["authorizer"]["userId"]
    wishlist_item_id = str(uuid.uuid4())
    deck_id = body['deck_id']
    wishlist_item = body['wishlist_item']

    wishlist_item = {
        'PK': f'USER#{user_id}',
        'SK': f'WISHLIST#{wishlist_item_id}',
        'wishlist_item_id' : wishlist_item_id,
        'entity_type': 'WISHLIST_ITEM',
        'created_at':datetime.utcnow().isoformat(),
        'last_modified': datetime.utcnow().isoformat(),
        'oracle_id': wishlist_item['oracle_id'],
        'image_url' : wishlist_item['image_url'],
        'card_market_id': wishlist_item['cardmarket_id'],
        'card_name': wishlist_item['card_name'],
        'user_id': user_id,
        'GSI1_PK': f'WISHLIST#{wishlist_item_id}',
        'GSI1_SK': f'USER#{user_id}',
        'GSI2_PK': f'DECK{deck_id}',
        'GSI2_SK':  f'WISHLIST#{wishlist_item_id}',
        'wishlist_item_id' : wishlist_item_id
    }

    try:
        response = table.put_item(
            Item=wishlist_item
        )
        logger.info(f'Result from table put item : {response}')
    except Exception as error:
        logger.info(f'Received an error: {error}')

    return {"statusCode": 200}

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)

        return json.JSONEncoder.default(self, obj)