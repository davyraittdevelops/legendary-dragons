import json
from unittest.mock import *
import os
import boto3
import botocore
import pytest
from moto import mock_dynamodb

TABLE_NAME = "connections"
OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_SESSION_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY": "True"
}

@pytest.fixture()
def table_definition():
    return {
        "TableName": TABLE_NAME,
        "AttributeDefinitions": [
            {"AttributeName": "PK", "AttributeType": "S"},
            {"AttributeName": "SK", "AttributeType": "S"},
        ],
        "KeySchema": [
            {"AttributeName": "PK", "KeyType": "HASH"},
            {"AttributeName": "SK", "KeyType": "RANGE"}
        ],

        "BillingMode": "PAY_PER_REQUEST"
    }

@pytest.fixture()
def websocket_event():
    """Generates Websocket Event"""
    return {
        "requestContext": {
            "connectionId": "eiC3NdK8IAMCIYA=",
            "requestId": "eiC3OH_tIAMF9Mw=",
            "apiId": "3ghgk1q3mf" ,
            "domainName": "3ghgk1q3mf.execute-api.us-east-1.amazonaws.com",
            "stage": "Prod",
        },
        "body": json.dumps({
            "action": "disconnect"
        }),
    }

orig = botocore.client.BaseClient._make_api_call

def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "PostToConnection":
        return None
    return orig(self, operation_name, kwarg)


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lambda_handler(websocket_event, table_definition):
    # Arrange
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.create_table(**table_definition)

    connectionItemToInsert = {
        "PK": "Connection#eiC3NdK8IAMCIYA=",
        "SK": "User#123",
        "entity_type": "CONNECTION",
        "domain": "3ghgk1q3mf.execute-api.us-east-1.amazonaws.com",
        "stage": "Prod",
        "connection_id": "eiC3NdK8IAMCIYA=",
        "user_id": "123"
    }

    table.put_item(Item=connectionItemToInsert)

    with patch('botocore.client.BaseClient._make_api_call', new=mock_make_api_call):
        # Act
        from functions.disconnect import app
        response = app.lambda_handler(websocket_event, {})
        
        # # Assert
        assert response['statusCode'] == 200
        assert response['body'] == 'Disconnected.'
