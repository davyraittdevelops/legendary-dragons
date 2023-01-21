import json
import logging
import os
import boto3
from decimal import Decimal
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
    user_id = event["requestContext"]["authorizer"]["userId"]
    endpoint = f"https://{domain_name}/{stage}"

    body = json.loads(event["body"])
    deck_id = body['deck_id']

    output = {"event_type": "GET_DECK_RESULT"}

    try:
        logger.info(f"Querying with deck_id {deck_id}")

        deck_response = table.query(
            KeyConditionExpression=Key("PK").eq(f"USER#{user_id}")
            &
            Key("SK").begins_with(f"DECK#{deck_id}")
        )['Items']

        logger.info(f"Deck response length: {len(deck_response)}")

        deck = next(
            (v for v in deck_response if v["entity_type"] == "DECK"),
            None
        )

        connection_id = event["requestContext"]["connectionId"]
        apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)

        if deck is None:
            output["error"] = "NOT_FOUND"
            apigateway.post_to_connection(
                ConnectionId=connection_id,
                Data=json.dumps(output, cls=DecimalEncoder)
            )
            return {"statusCode": 404}

        deck_cards = filter(
            lambda card: card["entity_type"] == "DECK_CARD",
            deck_response
        )
        side_deck_cards = filter(
            lambda card: card["entity_type"] == "SIDE_DECK_CARD",
            deck_response
        )
    except Exception as e:
        logger.info(f"Exception retrieving cards! {e}")

    output["data"] = {
        "deck": deck,
        "deck_cards": list(deck_cards),
        "side_deck_cards": list(side_deck_cards)
    }

    logger.info(
        "Deck(%s) with %s main deck cards & %s side deck cards",
        deck_id,
        len(output["data"]["deck_cards"]),
        len(output["data"]["side_deck_cards"])
    )

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
