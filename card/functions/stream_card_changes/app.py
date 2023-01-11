import json
import logging
import os
import boto3
from datetime import datetime
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

events_client = boto3.client("events")

def lambda_handler(event, context):
    """Convert DynamoDB streams into events for EventBridge."""
    events = []
    logger.info(f"Received Event: {event}")

    for record in event["Records"]:
        logger.info(f"Event: {record['eventName']} | {record['eventID']}")
        table_arn = record["eventSourceARN"].split("/stream")[0]

        events.append(
            {
                "Time": datetime.utcfromtimestamp(
                    record["dynamodb"]["ApproximateCreationDateTime"]
                ),
                "Source": "card.database",
                "Resources": [table_arn],
                "DetailType": record["eventName"],
                "Detail": json.dumps(record),
                "EventBusName": os.getenv("EVENT_BUS_NAME")
            }
        )

    events_client.put_events(Entries=events)
    return {"statusCode": 200}
