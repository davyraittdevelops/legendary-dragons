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
cards_table = dynamodb.Table('cards')
sqs = boto3.client('sqs')
target_sqs = os.getenv("CARD_ALERT_QUEUE")

def lambda_handler(event, context):
    """Get alerts and sends them to the sqs queue which processes the alerts."""
    response = get_all_alerts()
    alerts = response['Items']

    print('SQS TARGET IS : ' , target_sqs)
    for alert in alerts:
        result = sqs.send_message(QueueUrl=target_sqs, MessageBody=json.dumps(alert))
        print('result from sending to sqs is: ' , result)

    return {"statusCode": 200}

def get_all_alerts():
     # Specify the filter expression
    filter_expression = "(entity_type = :entity_type1 OR entity_type = :entity_type2)"

    # Specify the expression attribute values
    expression_attribute_values = {
        ':entity_type1': "ALERT#AVAILABILITY",
        ':entity_type2': "ALERT#PRICE"
    }

    # Use the scan method to retrieve all items from the table
    alerts = table.scan(
        FilterExpression=filter_expression,
        ExpressionAttributeValues=expression_attribute_values
    )
    
    return alerts 
