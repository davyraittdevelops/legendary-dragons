import boto3
import uuid
from boto3.dynamodb.conditions import Key, Attr
from aws_xray_sdk.core import patch_all

patch_all()

def lambda_handler(event, context):
    print('Onconnect...')
    try: 
        connect_id = str(uuid.uuid4())
        domain = event["requestContext"]["domainName"]
        stage = event["requestContext"]["stage"]
        #TODO: dont forget to change user!
        user_id = 123
        client = boto3.client("dynamodb")

        data = client.put_item(
            TabelName = "connections", 
            Item = {
            'PK': f'Connection#{connect_id}',
            'SK': f'User#{user_id}',
            'entity_type': 'Connection',
            'domain': domain,
            'stage': stage,
            'connection_id': connect_id,
            'user_id': user_id
        })
        print(data)
        print('Succesfully added connection to database.')
    except Exception as e:
        print(e)

    return {
        "statusCode": 200
    }
