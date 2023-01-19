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
    connection_id = event["requestContext"]["connectionId"]
    domain_name = event["requestContext"]["domainName"]
    stage = event["requestContext"]["stage"]
    endpoint = f"https://{domain_name}/{stage}"
    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)

    """Get card details by querying the cached cards database"""
    body = json.loads(event["body"])
    scryfall_id = body['scryfall_id']

    card_details_reponse = get_card_details(scryfall_id)
    card = card_details_reponse["Items"][0]
    card_faces_response = get_card_faces(scryfall_id)
    card_faces =  card_faces_response["Items"]

    output = {
        "event_type": "GET_CARD_RESULT",
        "deck_id": card,
        "data": card_faces
    }

    apigateway.post_to_connection(
        ConnectionId=connection_id,
        Data=json.dumps(output, cls=DecimalEncoder)
    )

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)

        return json.JSONEncoder.default(self, obj)

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
    

   
   