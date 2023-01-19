import json
import logging
import os
import boto3
from decimal import Decimal
from datetime import datetime
from boto3.dynamodb.conditions import Key
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()


dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))


def lambda_handler(event, context):
    domain_name = event["requestContext"]["domainName"]
    stage = event["requestContext"]["stage"]
    endpoint = f"https://{domain_name}/{stage}"

    body = json.loads(event["body"])
    deck_id = body['deck_id']

    try:
        logger.info(f"Querying with deck_id {deck_id}")

        deck = table.query(
            KeyConditionExpression=Key("PK").eq(f"DECK#{deck_id}")
            &
            Key("SK").begins_with("USER#")
        )['Items'][0]
        logger.info(f"Querying for deck successful, with deck_id {deck_id}")

        deck_cards = table.query(
            KeyConditionExpression=Key("GSI1_PK").eq(f"DECK#{deck_id}")
            &
            Key("GSI1_SK").begins_with("DECK_CARD#"),
            IndexName="GSI1"
        )['Items']
        logger.info(f"Querying for deck cards succesful, with deck_id {deck_id}")

        side_deck_cards = table.query(
            KeyConditionExpression=Key("GSI1_PK").eq(f"DECK#{deck_id}#SIDE_DECK")
            &
            Key("GSI1_SK").begins_with("DECK_CARD#"),
            IndexName="GSI1"
        )['Items']
    except Exception as e:
        logger.info(f"Exception retrieving cards! {e}")

    connection_id = event["requestContext"]["connectionId"]
    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)
    output = {
        "event_type": "GET_DECK_RESULT",
        "data": {
            "deck": deck,
            "deck_cards": deck_cards,
            "side_deck_cards": side_deck_cards
        }

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
