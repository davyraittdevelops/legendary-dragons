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
    """Accepts alerts and checks them against the card database."""
    entries = event['Records']
    print('userpoolid is : ' , user_pool)
    for entry in entries:
        alert = json.loads(entry['body'])
        if alert['entity_type'] == 'ALERT#AVAILABILITY':
            # handle_availability_alert(alert)
            print('availability alert... implement later')
        else:
            print('price alert... implement later')
            handle_price_alert(alert)
    
    return {"statusCode": 200}



def handle_price_alert(price_alert):
        oracle_id = price_alert['alert_id']
        user_id = price_alert['user_id']
        price_point = float(price_alert['price_point'])
        card_name = price_alert['card_name']

        user_email = get_user_email_by_id(user_id)
        cards = query_cards_table(oracle_id)

        print('Result from querying cards table is : ' , cards)
        for card in cards:
            prices = card['prices']
            print(prices)
            if prices['eur'] is None or prices['usd'] is None:
                break
            elif float(prices['eur']) < price_point or float(prices['usd']) < price_point :
                print('Price is below the request price.. ', prices['eur'], '||' , prices['usd'], "< " , price_point)
                send_email_to_user(user_email, card_name, prices, price_point)
     

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
    email =  response["UserAttributes"][3]['Value']
    return email

def send_email_to_user(destination, card_name, current_card_prices, target_price):
    # Define the email parameters
    recipient = destination
    sender = 'alerts@legendarydragons.cloud-native-minor.it'
    subject = 'Price Alert'
    eur_price = float(current_card_prices['eur'])
    usd_price = float(current_card_prices['usd'])
    body = f'Congratulations! The price alert for the card {card_name} has been triggered. The current card price is {eur_price}€ or {usd_price}$ and your alert was set to {target_price}$/€. '

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

    print(response)