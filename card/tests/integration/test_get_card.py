import os
import json
import pytest
import boto3
from moto import mock_dynamodb
from unittest.mock import patch
import botocore.client
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)
TABLE_NAME = "cards"
OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY":  "True",
    "EVENT_BUS_NAME": "test-event-bus",
    "TABLE_NAME": TABLE_NAME
 }


@pytest.fixture()
def websocket_event():
    return {
        "requestContext": {
            "domainName": "localhost",
            "stage": "Prod",
            "connectionId": "assfgefg",
            "authorizer": {
                "userId": "user-123"
            }
        },
        "body": json.dumps({
            "scryfall_id": "scry-13",
        }),
    }


@pytest.fixture()
def table_definition():
    return {
        "TableName": TABLE_NAME,
        "KeySchema": [
            {"AttributeName": "PK", "KeyType": "HASH"},
            {"AttributeName": "SK", "KeyType": "RANGE"}
        ],
        "AttributeDefinitions": [
            {"AttributeName": "PK", "AttributeType": "S"},
            {"AttributeName": "SK", "AttributeType": "S"},
            {"AttributeName": "GSI1_PK", "AttributeType": "S"},
            {"AttributeName": "GSI1_SK", "AttributeType": "S"},
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


orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "PostToConnection":
        return None
    return orig(self, operation_name, kwarg)


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lambda_handler(websocket_event, table_definition):
    # Arrange
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)

    table.put_item(Item={
        "PK": "CARD#scry-13",
        "SK": "CARD_FACE#123",
        "GSI1_SK": "CARD#scry-13",
        "GSI1_PK": "CARD_FACE#123"
    })

    table.put_item(Item={
        "SK": "CARD#scry-13",
        "PK": "CARD_FACE#123",
        "GSI1_PK": "CARD#scry-13",
        "GSI1_SK": "CARD_FACE#123"
    })

    # Act
    with patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call):
        from functions.get_card import app
        response = app.lambda_handler(websocket_event, {})

        # Assert
        print(response)
        assert response["statusCode"] == 200
