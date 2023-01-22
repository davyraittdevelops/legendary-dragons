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
    print('event is : ' , event)

    availability_alert = {
        "card_market_id": '7801',
        'entity_type': 'ALERT#AVAILABILITY'
    }

    price_alert = {
        "card_market_id": '7801',
        'entity_type': 'ALERT#AVAILABILITY'
    }

    alerts = []

    alerts.append(availability_alert)
    alerts.append(price_alert)

    for alert in alerts:
        print(alert)


    # try:
    #     logger.info(f'Querying with the following wishlist_item_id {wishlist_item_id}')
    #     alert_items = table.query(
    #         KeyConditionExpression=Key("PK").eq(f"USER#{user_id}") 
    #         &
    #         Key("SK").begins_with(f"WISHLIST_ITEM#{wishlist_item_id}#ALERT#")
    #     )['Items']
    #     logger.info(f'Result from table get item : {alert_items}')
    # except Exception as error:
    #     logger.info(f'Received an error: {error}')

    return {"statusCode": 200}