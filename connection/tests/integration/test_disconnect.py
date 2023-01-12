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
            {"AttributeName": "GSI1_PK", "AttributeType": "S"},
            {"AttributeName": "GSI1_SK", "AttributeType": "S"},
        ],
        "KeySchema": [
            {"AttributeName": "PK", "KeyType": "HASH"},
            {"AttributeName": "SK", "KeyType": "RANGE"}
        ],
        "GlobalSecondaryIndexes": [
            {
                "IndexName": "GSI1",
                "Projection": {"ProjectionType": "ALL"},
                "KeySchema": [
                    {"AttributeName": "GSI1_PK", "KeyType": "HASH"},
                    {"AttributeName": "GSI1_SK", "KeyType": "RANGE"}
                ]
            }
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
            "authorizer": {
                "userId": "12324"
            }
        },
        "body": json.dumps({
            "action": "disconnect"
        }),
    }


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lambda_handler(websocket_event, table_definition):
    # Arrange
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.create_table(**table_definition)

    connection_item_to_insert = {
        "PK": "CONNECTION#eiC3NdK8IAMCIYA=",
        "SK": "USER#12324",
        "entity_type": "CONNECTION",
        "domain": "3ghgk1q3mf.execute-api.us-east-1.amazonaws.com",
        "stage": "Prod",
        "connection_id": "eiC3NdK8IAMCIYA=",
        "user_id": "12324"
    }

    table.put_item(Item=connection_item_to_insert)

    # Act
    from functions.disconnect import app
    response = app.lambda_handler(websocket_event, {})

    # # Assert
    assert response['statusCode'] == 200
    assert response['body'] == 'Disconnected.'
