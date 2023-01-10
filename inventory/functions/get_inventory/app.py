import json
import logging
import os
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

    endpoint = f"https://{domain_name}/{stage}"
    output = {
        "event_type": "GET_INVENTORY_RESULT",
        "data": []
    }

    logger.info(f"Request will be made to {endpoint}")

    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)

    logger.info(event)
    body = json.loads(event["body"])

    # TODO: Check how to retrieve user id
    inventory_id = body["inventory_id"]
    user_id = body["user_id"]

    inventory = table.get_item(
        Key={
            "PK": f"INVENTORY#{inventory_id}",
            "SK": f"USER#{user_id}"
        }
    )

    if "Item" not in inventory:
        logger.info(f"Inventory with id = {inventory_id} not found")
        output["error"] = "NOT_FOUND"
        apigateway.post_to_connection(
            ConnectionId=connection_id,
            Data=json.dumps(output)
        )
        return {"statusCode": 404}

    inventory_cards = table.query(
        KeyConditionExpression=Key("GSI1_PK").eq(f"INVENTORY#{inventory_id}") &
        Key("GSI1_SK").begins_with("INVENTORY_CARD"),
        IndexName="GSI1"
    )["Items"]

    logger.info(f"Found {len(inventory_cards)} inventory cards")

    inventory["Item"]["inventory_cards"] = inventory_cards
    output["data"] = inventory["Item"]

    logger.info(f"Sending inventory result to client with id: {connection_id}")

    apigateway.post_to_connection(
        ConnectionId=connection_id,
        Data=json.dumps(output)
    )
    return {"statusCode": 200}
