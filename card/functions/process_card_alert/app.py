import json
import logging
import os
import boto3
from datetime import datetime
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

events_client = boto3.client("events")
cognito_client = boto3.client("cognito-idp", region_name="us-east-1")
user_pool_id = 'us-east-1_H1AyV4HD1'

def lambda_handler(event, context):
    """Accepts alerts and checks them against the card database."""
    print('Received a input! : ' , event)

    #Read event to get the alert. 
    # Sort by price and availability alert
    # alerts = response['Items']
    # for alert in alerts:
    #     if alert['entity_type'] == 'ALERT#AVAILABILITY':
    #         availability_alerts.append(alert)
    #     else:
    #         price_alerts.append(alert)
    
    return {"statusCode": 200}



# def handle_price_alerts(price_alerts):
#      #Handle price alerts , read from our cached database
#     for price_alert in price_alerts:
#         print(price_alert)
#         oracle_id = price_alert['alert_id']
#         user_id = price_alert['user_id']
#         price_point = float(price_alert['price_point'])
#         card_name = price_alert['card_name']
#         user_email = get_user_email_by_id(user_id)
#         try:
#             result = cards_table.query(
#                 KeyConditionExpression=Key("GSI1_PK").eq(f'CARD_FACE#{oracle_id}')
#                 &
#                 Key("GSI1_SK").begins_with('CARD#'),
#                 IndexName="GSI1"
#             )
#             cards = result['Items']
#             for card in cards:
#                 prices = card['prices']
#                 print(prices)
#                 if prices['eur'] is None or prices['usd'] is None:
#                     break
#                 elif float(prices['eur']) < price_point or float(prices['usd']) < price_point :
#                     print('Price is below the request price.. ', prices['eur'], '||' , prices['usd'], "< " , price_point)
#                     send_email_to_user(user_email, card_name, prices, price_point)

#         except Exception as e:
#             logger.info(f"Error occured:  {e}")

# def get_user_email_by_id(uid):
#     response = client.admin_get_user(
#     UserPoolId=user_pool_id,
#     Username=uid
#     )
#     email =  response["UserAttributes"][3]['Value']
#     return email

# def send_email_to_user(destination, card_name, current_card_prices, target_price):
     # Create an SES client
    # ses = boto3.client('ses')

    # # Define the email parameters
    # recipient = destination
    # sender = 'alerts@legendarydragons.cloud-native-minor.it'
    # subject = 'Price Alert'
    # eur_price = float(current_card_prices['eur'])
    # usd_price = float(current_card_prices['usd'])
    # body = f'Congratulations! The price alert for the card {card_name} has been triggered. The current card price is {eur_price}€ or {usd_price}$ and your alert was set to {target_price}$/€. '

    # # Send the email
    # response = ses.send_email(
    #     Destination={
    #         'ToAddresses': [
    #             recipient,
    #         ],
    #     },
    #     Message={
    #         'Body': {
    #             'Text': {
    #                 'Charset': 'UTF-8',
    #                 'Data': body,
    #             },
    #         },
    #         'Subject': {
    #             'Charset': 'UTF-8',
    #             'Data': subject,
    #         },
    #     },
    #     Source=sender,
    # )

    # print(response)