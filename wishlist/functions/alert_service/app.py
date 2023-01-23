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
cards_table = dynamodb.Table('cards')
client = boto3.client("cognito-idp", region_name="us-east-1")
user_pool_id = 'us-east-1_H1AyV4HD1'

def lambda_handler(event, context):
    """Get alerts for user."""
    price_alerts = []
    availability_alerts = []
    response = query_alerts()
    
    # Sort by price and availability alert
    alerts = response['Items']
    for alert in alerts:
        if alert['entity_type'] == 'ALERT#AVAILABILITY':
            availability_alerts.append(alert)
        else:
            price_alerts.append(alert)

    handle_price_alerts(price_alerts)

    return {"statusCode": 200}

def query_alerts():
     # Specify the filter expression
    filter_expression = "(entity_type = :entity_type1 OR entity_type = :entity_type2)"

    # Specify the expression attribute values
    expression_attribute_values = {
        ':entity_type1': "ALERT#AVAILABILITY",
        ':entity_type2': "ALERT#PRICE"
    }

    # Use the scan method to retrieve all items from the table
    response = table.scan(
        FilterExpression=filter_expression,
        ExpressionAttributeValues=expression_attribute_values
    )

    return response 


def handle_price_alerts(price_alerts):
     #Handle price alerts , read from our cached database
    for price_alert in price_alerts:
        oracle_id = price_alert['alert_id']
        user_id = price_alert['user_id']
        price_point  = price_alert['price_point']
        user_email = get_user_email_by_id(user_id)

        try:
            result = cards_table.query(
                KeyConditionExpression=Key("GSI1_PK").eq(f'CARD_FACE#{oracle_id}')
                &
                Key("GSI1_SK").begins_with('CARD#'),
                IndexName="GSI1"
            )
            cards = result['Items']
            print('Found this amount of cards with the oracle id: ' , len(cards))
            for card in cards:
                print(card)
                prices = card['prices']

        except Exception as e:
            logger.info(f"Error occured:  {e}")

def get_user_email_by_id(uid):
    response = client.admin_get_user(
    UserPoolId=user_pool_id,
    Username=uid
    )
    email =  response["UserAttributes"][3]['Value']
    print('email is ' , email)
    return email