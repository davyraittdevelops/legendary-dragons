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
    output = {"event_type": "GET_DECKS_RESULT", "data": []}
    connection_id = event["requestContext"]["connectionId"]
    user_id = event["requestContext"]["authorizer"]["userId"]

    domain_name = event["requestContext"]["domainName"]
    stage = event["requestContext"]["stage"]
    endpoint = f"https://{domain_name}/{stage}"

    logger.info(f"Request will be made to {endpoint}")

    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)

    logger.info("Searching for decks in user %s", user_id)
    decks_response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}") &
        Key("SK").begins_with("DECK#")
    )["Items"]

    decks = filter(lambda deck: deck["entity_type"] == "DECK", decks_response)

    output["data"] = list(decks)
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
