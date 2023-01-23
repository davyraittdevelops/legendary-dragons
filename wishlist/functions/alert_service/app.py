import json
import logging
import os
import boto3
from aws_xray_sdk.core import patch_all
from boto3.dynamodb.conditions import Key
from decimal import Decimal


logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(os.getenv("TABLE_NAME"))

def lambda_handler(event, context):
    """Get alerts for user."""

            # Specify the filter expression
    filter_expression = "(entity_type = :entity_type1 OR entity_type = :entity_type2)"

    # Specify the expression attribute values
    expression_attribute_values = {
        ':entity_type1': "ALERT#AVAILABILITY",
        ':entity_type2': "ALERT#PRICE"
    }

    # Use the scan method to retrieve all items from the table
    response = table.scan(
        FilterExpression=filter_expression,
        ExpressionAttributeValues=expression_attribute_values
    )

    price_alerts = []
    availability_alerts = []

    # Print the filtered items
    alerts = response['Items']
    for alert in alerts:
        if alert['entity_type'] == 'ALERT#AVAILABILITY':
            availability_alerts.append(alert)
        else:
            price_alerts.append(alert)

    print(price_alerts)
    print(availability_alerts)


    return {"statusCode": 200}