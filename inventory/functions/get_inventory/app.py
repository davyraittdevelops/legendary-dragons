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


def lambda_handler(event, context):
    """Get a inventory entry for a specific user."""
    connection_id = event["requestContext"]["connectionId"]
    domain_name = event["requestContext"]["domainName"]
    stage = event["requestContext"]["stage"]

    body = json.loads(event["body"])
    paginator_key = body["paginatorKey"]
    query_args = {}

    if paginator_key:
        query_args["ExclusiveStartKey"] = paginator_key
        logger.info(f"paginator: {paginator_key}")

    endpoint = f"https://{domain_name}/{stage}"
    output = {
        "event_type": "GET_INVENTORY_RESULT",
        "data": []
    }

    logger.info(f"Request will be made to {endpoint}")
    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)

    user_id = event["requestContext"]["authorizer"]["userId"]
    inventory_response = table.query(
        KeyConditionExpression=Key("PK").eq(f"USER#{user_id}") &
        Key("SK").begins_with("INVENTORY"),
        Limit=49,
        **query_args
    )

    scanned_count = inventory_response["ScannedCount"]

    if 'LastEvaluatedKey' in inventory_response:
        output["paginatorKey"] = inventory_response["LastEvaluatedKey"]

    inventory = {}

    if not paginator_key:
        logger.info("No paginator key, looking for Inventory")

        inventory_idx = next(
            (idx for idx, item in enumerate(inventory_response["Items"]) if item["entity_type"] == "INVENTORY"),
            None
        )

        if inventory_idx is None:
            logger.info("Inventory not found")
            output["error"] = "NOT_FOUND"
            apigateway.post_to_connection(
                ConnectionId=connection_id,
                Data=json.dumps(output)
            )
            return {"statusCode": 404}

        inventory = inventory_response["Items"].pop(inventory_idx)
        scanned_count -= 1
        logger.info(f"Found inventory with id {inventory['inventory_id']}")

    logger.info("Found inventory cards: %s", len(inventory_response["Items"]))
    inventory["inventory_cards"] = inventory_response["Items"]
    output["data"] = inventory
    output["total_cards"] = scanned_count

    logger.info(f"Sending inventory result to client with id: {connection_id}")

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
