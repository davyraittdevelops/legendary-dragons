import boto3
from aws_xray_sdk.core import patch_all

patch_all()

def lambda_handler(event, context):
    print('Disconnect...')
    try: 
        #TODO: not sure about connect_id and user_id
        connect_id = event['body']['connect_id']
        user_id = event['body']['user_id']

        remove = boto3.client('dynamodb')
        remove.delete_item(
            TableName = "connections",
            Key = {
                'PK': {'S' :f'Connection#{connect_id}'},
                'SK': {'S' :f'User#{user_id}'}
            },
            ConditionExpression = 'attribute_exists(connect_id)',
            ReturnValues = 'ALL_OLD'
        )
        print('Succesfully removed connection from database.')
        print(remove)
    except Exception as e:
        print(e)

    return {
        "statusCode": 200
    }
