import boto3
from boto3.dynamodb.conditions import Key, Attr
from aws_xray_sdk.core import patch_all
import logging
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

def lambda_handler(event, context):
    logger.info('Onconnect...')
    logger.info(event)
    try: 
        connect_id = event["requestContext"]["connectionId"]
        domain = event["requestContext"]["domainName"]
        stage = event["requestContext"]["stage"]
        #TODO: dont forget to change user!
        user_id = str(123)
        client = boto3.resource("dynamodb")

        table = client.Table("connections")
        data = table.put_item(
            Item = {
            "PK": "Connection#" + connect_id,
            "SK": "User#" + user_id,
            "entity_type": "Connection",
            "domain": domain,
            "stage": stage,
            "connection_id": connect_id,
            "user_id": user_id
        })
        logger.info(data)
        logger.info('Succesfully added connection to database.')
    except Exception as e:
        logger.error('Error: ', e)

    return {
        "statusCode": 200,
        "body": "Connected."
    }
