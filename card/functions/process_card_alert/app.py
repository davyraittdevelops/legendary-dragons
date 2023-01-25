import json
import logging
import os
import boto3
from datetime import datetime
from boto3.dynamodb.conditions import Key
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

cognito_client = boto3.client("cognito-idp", region_name="us-east-1")
user_pool = os.getenv("COGNITO_CLIENT") 

ses = boto3.client('ses')

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))

def lambda_handler(event, context):

    """Accepts alerts and checks them against the card database for price/availability values."""
    entries = event['Records']
    for entry in entries:
        alert = json.loads(entry['body'])
        if alert['entity_type'] == 'ALERT#AVAILABILITY':
            handle_availability_alert(alert)
        else:
            handle_price_alert(alert)
    
    return {"statusCode": 200}



def handle_price_alert(price_alert):
        oracle_id = price_alert['alert_id']
        user_id = price_alert['user_id']
        price_point = float(price_alert['price_point'])
        card_name = price_alert['card_name']
        subject = 'Price alert triggered'

        user_email = get_user_email_by_id(user_id)
        cards = query_cards_table(oracle_id)

        for card in cards:
            prices = card['prices']
            for key, value in prices.items():
                if value is not None:
                    if float(value) < price_point:
                        body = f'Congratulations! The price alert for the card {card_name} has been triggered. The current card price is {value} {key} and your alert price value was set to {price_point}'
                        send_email_to_user(user_email, body, subject) 
                        break

def handle_availability_alert(availability_alert):
        oracle_id = availability_alert['alert_id']
        user_id = availability_alert['user_id']
        card_name = availability_alert['card_name']
        subject = 'Availability alert triggered'

        user_email = get_user_email_by_id(user_id)
        cards = query_cards_table(oracle_id)

        for card in cards:
            prices = card['prices']
            for key, value in prices.items():
                if value is not None:
                    body = f'Congratulations! The availability alert for the card {card_name} has been triggered. The card is available for {value} {key}'
                    send_email_to_user(user_email, body, subject)
                    break

                

def query_cards_table(oracle_id): 
    result = table.query(
                KeyConditionExpression=Key("GSI1_PK").eq(f'CARD_FACE#{oracle_id}')
                &
                Key("GSI1_SK").begins_with('CARD#'),
                IndexName="GSI1"
            )
    return result['Items']

def get_user_email_by_id(uid):
    response = cognito_client.admin_get_user(
    UserPoolId=user_pool,
    Username=uid
    )
    
    for user_attribute in response["UserAttributes"]:
        if user_attribute['Name'] == 'email':
            email =  user_attribute['Value']

    return email

def send_email_to_user(destination, body, subject ):
    # Define the email parameters
    recipient = destination
    sender = 'alerts@legendarydragons.cloud-native-minor.it'

    # Send the email
    response = ses.send_email(
        Destination={
            'ToAddresses': [
                recipient,
            ],
        },
        Message={
            'Body': {
                'Text': {
                    'Charset': 'UTF-8',
                    'Data': body,
                },
            },
            'Subject': {
                'Charset': 'UTF-8',
                'Data': subject,
            },
        },
        Source=sender,
    )
    logger.info(f'Result from sending the email is : {response}')
