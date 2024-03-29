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
    table = dynamodb.create_table(**table_definition)

    # Act
    from functions.onconnect import app
    response = app.lambda_handler(websocket_event, {})
    cid = f"CONNECTION#{websocket_event['requestContext']['connectionId']}"
    user = f"USER#{websocket_event['requestContext']['authorizer']['userId']}"

    item = table.get_item(
        Key={"PK": cid, "SK": user}
    )["Item"]

    # Assert
    assert response['statusCode'] == 200
    assert response['body'] == 'Connected.'
    assert item["domain"] == websocket_event["requestContext"]["domainName"]
