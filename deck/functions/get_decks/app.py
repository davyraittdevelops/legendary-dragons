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
    endpoint = f"https://{domain_name}/{stage}"
    output = {
        "event_type": "GET_DECKS_RESULT",
        "data": []
    }
    logger.info(f"Request will be made to {endpoint}")

    output = {"event_type": "GET_DECK_RESULT", "data": []}
    connection_id = event["requestContext"]["connectionId"]
    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)

    user_id = event["requestContext"]["authorizer"]["userId"]
    logger.info("Searching for decks in user %s", user_id)

    decks = table.query(
        KeyConditionExpression=Key("GSI1_PK").eq(f"USER#{user_id}") &
        Key("GSI1_SK").begins_with("DECK#"),
        IndexName="GSI1"
    )

    output["data"] = decks["Items"]
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
