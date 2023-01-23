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
    print(event)

    '''Insert alert of type price/availability into the dynamodb'''
    body = json.loads(event["body"])
    user_id = event["requestContext"]["authorizer"]["userId"]
    wishlist_item_id = body['wishlist_item_id']
    alert_item = body['alert_item']
    print('alert item is: ', alert_item)
    current_datetime = datetime.utcnow().isoformat()
    alert_id = alert_item['alert_id']


    alert = {
        'PK' : f'USER#{user_id}',
        'SK' : f'WISHLIST_ITEM#{wishlist_item_id}#ALERT#AVAILABILITY#{alert_id}',
        'entity_type' : 'ALERT#AVAILABILITY',
        'created_at': current_datetime,
        'last_modified': current_datetime,
        'card_market_id': alert_item['card_market_id'],
        'alert_id' : alert_id,
        'user_id' : user_id,
        'GSI1_PK': f'WISHLIST_ITEM#{wishlist_item_id}#ALERT#AVAILABILITY#{alert_id}',
        'GSI1_SK': f'USER{user_id}',
        'wishlist_item_id' : wishlist_item_id
    }

    if alert_item['alert_type'] == 'PRICE': 
        alert['entity_type'] = 'ALERT#PRICE'
        alert['SK'] = f'WISHLIST_ITEM#{wishlist_item_id}#ALERT#PRICE#{alert_id}'
        alert['price_point'] = alert_item['price_point']
        alert['GSI1_PK'] = f'WISHLIST_ITEM#{wishlist_item_id}#ALERT#PRICE#{alert_id}'


    try:
        response = table.put_item(
            Item=alert
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