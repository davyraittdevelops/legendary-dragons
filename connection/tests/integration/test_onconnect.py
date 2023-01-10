import json
from unittest.mock import *
import os
import boto3
import botocore
import pytest
from moto import mock_dynamodb

@pytest.fixture()
def event():
    return {'requestContext': { 
        "connectionId": "eiC3NdK8IAMCIYA=",
        "requestId": "eiC3OH_tIAMF9Mw=",
        "apiId": "3ghgk1q3mf" ,
        "domainName": "3ghgk1q3mf.execute-api.us-east-1.amazonaws.com",
        "stage": "Prod",
    }}

OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_SESSION_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY": "True"
}

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lambda_handler(event):
    from functions.onconnect.app import lambda_handler
    # Arrange
    orig = botocore.client.BaseClient._make_api_call

    dynamodb = boto3.resource('dynamodb')
    dynamodb.create_table(
        TableName='connections',
        AttributeDefinitions=[
            {
                'AttributeName': 'PK',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'SK',
                'AttributeType': 'S'
            }
        ],
        KeySchema=[
            {
                'AttributeName': 'PK',
                'KeyType': 'HASH'
            },
            {
                'AttributeName': 'SK',
                'KeyType': 'RANGE'
            }
        ],
        BillingMode='PAY_PER_REQUEST'
    )

    def mock_make_api_call(self, operation_name, kwarg):
        if operation_name == 'PostToConnection':
            return None
        return orig(self, operation_name, kwarg)

    with patch('botocore.client.BaseClient._make_api_call', new=mock_make_api_call) as mock_method:
        # Act
        response = lambda_handler(event, {})
        body = json.dumps(response['body'])
        # # Assert
        assert response['statusCode'] == 200
        assert event["requestContext"]["connectionId"] == "eiC3NdK8IAMCIYA="
        assert body == '"Connected."'