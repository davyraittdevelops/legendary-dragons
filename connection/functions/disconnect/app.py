import boto3
from aws_xray_sdk.core import patch_all
import logging
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

def lambda_handler(event, context):
    logger.info('Disconnect...')
    try: 
        #TODO: dont forget to change user!
        connect_id = event["requestContext"]["connectionId"]
        user_id = "123"

        client = boto3.resource("dynamodb")
        table = client.Table("connections")
        response = table.delete_item(
            Key = {
                "PK": "Connection#" + connect_id,
                "SK": "User#" + user_id
            },
            ReturnValues = 'ALL_OLD'
        )
        logger.info(response)
        logger.info('Succesfully removed connection from database.')
    except Exception as e:
        logger.error('Error: ', e)

    return {
        "statusCode": 200
    }
