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
table = dynamodb.Table(os.environ["TABLE_NAME"])


def query_user_connections(user_id):
    """Query all the Websocket connections for a user."""
    return table.query(
        KeyConditionExpression=Key("GSI1_PK").eq(f"USER#{user_id}") &
        Key("GSI1_SK").begins_with("CONNECTION"),
        IndexName="GSI1"
    )["Items"]


def datatype_value(type_value):
    """Extract the value from the given Dynamodb data type."""
    return type_value[next(iter(type_value))]



def lambda_handler(event, context):
    image_type = "NewImage"

    if "NewImage" not in event["detail"]["dynamodb"]:
        image_type = "OldImage"

    image = event["detail"]["dynamodb"][image_type]
    event_name = event["detail"]["eventName"]
    entity_type = event["detail"]["dynamodb"][image_type]["entity_type"]["S"]
    pk = event["detail"]["dynamodb"]["Keys"]["PK"]["S"]

    # Convert dynamodb new image format to useable frontend format
    mapped_image = dict(
        map(lambda kv: (kv[0], datatype_value(kv[1])), image.items())
    )

    user_id = mapped_image["user_id"]

    logger.info(f"Sending new image (PK={pk}) to active connections to a user")
    logger.info("Getting all active connections from DynamoDB")
    connections = query_user_connections(user_id)

    for connection in connections:
        connection_id = connection["connection_id"]
        domain_name = connection["domain"]
        stage = connection["stage"]

        gateway_management = boto3.client(
            "apigatewaymanagementapi",
            endpoint_url=f"https://{domain_name}/{stage}"
        )
        try:
            logger.info(f"https://{domain_name}/{stage}")
            logger.info(f"Connection id: {connection_id}")
            gateway_management.post_to_connection(
                ConnectionId=connection_id,
                Data=json.dumps({
                    "data": mapped_image,
                    "event_type": f"{event_name}_{entity_type}_RESULT"
                })
            )
        except Exception as error:
            logger.error('Error: %s', error)
            table.delete_item(
                Key={
                    "PK": "CONNECTION#" + connection_id,
                    "SK": "USER#" + user_id
                },
            )
            logger.info('Succesfully removed connection from database.')

    return {"statusCode": 200}
