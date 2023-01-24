import json
import logging
import os
from decimal import Decimal
import boto3
from boto3.dynamodb.conditions import Key
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))


class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)

        return json.JSONEncoder.default(self, obj)


def lambda_handler(event, context):
    """Search for inventory cards by name for a specific user."""
    connection_id = event["requestContext"]["connectionId"]
    domain_name = event["requestContext"]["domainName"]
    stage = event["requestContext"]["stage"]

    user_id = event["requestContext"]["authorizer"]["userId"]
    body = json.loads(event["body"])
    filter_expression = generate_filter_query(body["filter"])
    card_name = body["card_name"].lower().strip()
    paginator_key = body["paginatorKey"]
    query_args = {}

    if paginator_key:
        query_args["ExclusiveStartKey"] = paginator_key
        logger.info(f"paginator: {paginator_key}")

    output = {
        "event_type": "GET_INVENTORY_CARD_RESULT",
        "data": []
    }

    endpoint = f"https://{domain_name}/{stage}"
    logger.info(f"Request will be made to {endpoint}")
    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)

    logger.info(
        "Searching for cards with name: %s and filter %s",
        card_name, filter_expression
    )

    cards_response = table.query(
        KeyConditionExpression=Key("GSI1_PK").eq(f"USER#{user_id}") &
        Key("GSI1_SK").begins_with(f"INVENTORY_CARD#{card_name}"),
        IndexName="GSI1",
        Limit=49,
        **query_args,
        **filter_expression
    )

    scanned_count = cards_response["ScannedCount"]

    if 'LastEvaluatedKey' in cards_response:
        output["paginatorKey"] = cards_response["LastEvaluatedKey"]

    logger.info("Found inventory cards: %s", len(cards_response["Items"]))
    output["data"] = cards_response["Items"]
    output["total_cards"] = scanned_count

    logger.info(f"Sending inventory result to client with id: {connection_id}")
    apigateway.post_to_connection(
        ConnectionId=connection_id,
        Data=json.dumps(output, cls=DecimalEncoder)
    )
    return {"statusCode": 200}


def generate_filter_query(fields):
    """Dynamically generate filter queries based on the given input."""
    if not fields:
        return fields

    expression = {
        "FilterExpression": "",
        "ExpressionAttributeNames": {},
        "ExpressionAttributeValues": {}
    }

    for field, value in fields.items():
        expression_value = f" #{field} = :{field} and"

        if field == "colors":
            expression_value = f" #{field} in (:{field}) and"

        expression["FilterExpression"] += expression_value
        expression["ExpressionAttributeNames"][f"#{field}"] = field
        expression["ExpressionAttributeValues"][f":{field}"] = value

    # Remove trailing " and"
    expression["FilterExpression"] = expression["FilterExpression"][:-4]

    return expression
