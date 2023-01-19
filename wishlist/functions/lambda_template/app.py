import json
import logging
import os
import boto3
import uuid
from datetime import datetime
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))


def lambda_handler(event, context):
    """Read neccesary information from the body/event."""
    # connection_id = event["requestContext"]["connectionId"]
    # domain_name = event["requestContext"]["domainName"]
    # stage = event["requestContext"]["stage"]
    # endpoint = f"https://{domain_name}/{stage}"
    # apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)
    # body = json.loads(event["body"])
    

    """Do query/data manipulation."""
   

    """Post output back to the connection."""
    #  output = {
    #     "event_type": "GET_CARD_RESULT",
    #     "deck_id": card,
    #     "data": card_faces
    # }

    # apigateway.post_to_connection(
    #     ConnectionId=connection_id,
    #     Data=json.dumps(output, cls=DecimalEncoder)
    # )
    return {"statusCode": 200}

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)

        return json.JSONEncoder.default(self, obj)