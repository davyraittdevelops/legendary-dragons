import json
from unittest.mock import *
import os
import boto3
import pytest
from moto import mock_dynamodb

TABLE_NAME = "connections"
OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_SESSION_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY": "True",
    "TABLE_NAME": TABLE_NAME
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
            "apiId": "3ghgk1q3mf",
            "domainName": "3ghgk1q3mf.execute-api.us-east-1.amazonaws.com",
            "stage": "Prod",
            "authorizer": {
                "userId": "12324"
            }
        }
    }


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lambda_handler(websocket_event, table_definition):
    # Arrange
    dynamodb = boto3.resource('dynamodb')
    dynamodb.create_table(**table_definition)

    # Act
    from functions.onconnect import app
    response = app.lambda_handler(websocket_event, {})

    # Assert
    assert response['statusCode'] == 200
    assert response['body'] == 'Connected.'
