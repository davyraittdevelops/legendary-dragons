import json
import logging
import os
import time
import requests
import boto3
from aws_xray_sdk.core import patch_all
from boto3.dynamodb.conditions import Key


logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")
cards = dynamodb.Table(os.getenv("TABLE_NAME"))

def lambda_handler(event, context):
    """Get details from event."""
    # connection_id = event["requestContext"]["connectionId"]
    # domain_name = event["requestContext"]["domainName"]
    # stage = event["requestContext"]["stage"]
    # endpoint = f"https://{domain_name}/{stage}"
    # apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)

    """Get card details by querying the cached cards database"""
    print('Get card details by querying the cached cards database')
    # body = json.loads(event["body"])
    # scryfall_id = body['scryfall_id']

    scryfall_id = 'c7d5e394-8e41-442e-ae97-a478a61e1b9d'
    card_details = get_card_details(scryfall_id)
    print('## Got back ', card_details)
    card = card_details["Items"][0]

    print('deserialized card is ', card)
    oracle_id = card['oracle_id']
    print('oracle id is ##' , oracle_id)

    get_card_faces(scryfall_id)

def get_card_details(scryfall_id):
    """Get card details by querying the cached cards database"""
    try:
        cards_result = cards.query(
            KeyConditionExpression=Key("PK").eq(f'CARD#{scryfall_id}')
            &
            Key("SK").begins_with("CARD_FACE") ,
        )
        logger.info(f"Querying for deck cards succesful, result is {cards_result}")
        return cards_result
    except Exception as e:
        logger.info(f"Exception retrieving cards! {e}")
        return e
    

def get_card_faces(scryfall_id):
    """Get card details by querying the cached cards database"""
    try:
        card_faces_result = cards.query(
            KeyConditionExpression=Key("GSI1_PK").eq(f'CARD#{scryfall_id}')
            &
            Key("GSI1_SK").begins_with("CARD_FACE#"),
            IndexName="GSI1"
        )
        logger.info(f"Querying for deck cards succesful, result is {card_faces_result}")
        return card_faces_result
    except Exception as e:
        logger.info(f"Exception retrieving cards! {e}")
        return e
    

   
   