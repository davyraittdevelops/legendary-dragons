import os
import json
import botocore.client
import boto3
import pytest
from moto import mock_dynamodb
from unittest.mock import patch
from boto3.dynamodb.conditions import Key

CONNECTION_ID = "abcdefg"
TABLE_NAME = "test_inventory"
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


@pytest.fixture()
def inventory_card():
    return {
        "card_name": "Swords of Doom", "oracle_id": "oracle-123",
        "colors": ["R"], "prices": {"usd": "0.05"},
        "rarity": "meta", "quality": "rare",
        "scryfall_id": "scryfall-1"
    }


@pytest.fixture()
def websocket_event():
    """Generates Websocket Event"""
    return {
        "requestContext": {
            "domainName": "localhost",
            "stage": "Prod",
            "connectionId": CONNECTION_ID,
            "authorizer": {
                "userId": "user-123"
            }
        },
        "body": json.dumps({
            "action": "getInventoryReq",
            "inventory_id": "inv-12",
        }),
    }


orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "PostToConnection":
        return None
    return orig(self, operation_name, kwarg)


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lamda_handler_success(websocket_event, table_definition,
                               inventory_card):
    # Arrange
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)
    table.put_item(Item={
        "PK": "INVENTORY#inv-12",
        "SK": "USER#user-123",
        "entity_type": "INVENTORY",
        "inventory_id": "inv-12",
        "user_id": "user-123"
    })
    table.put_item(Item={
        "PK": "INVENTORY_CARD#card-1",
        "SK": "INVENTORY#inv-12",
        "GSI1_PK": "INVENTORY#inv-12",
        "GSI1_SK": "INVENTORY_CARD#card-1",
        "entity_type": "INVENTORY_CARD",
        "inventory_id": "inv-12",
        "card_id": "card-1",
        **inventory_card
    })

    with patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call):
        # Act
        from functions.get_inventory import app
        response = app.lambda_handler(websocket_event, {})

        # Assert
        assert response["statusCode"] == 200


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lamda_handler_not_found(websocket_event, table_definition):
    # Arrange
    dynamodb = boto3.resource("dynamodb")
    dynamodb.create_table(**table_definition)

    with patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call):
        # Act
        from functions.get_inventory import app
        response = app.lambda_handler(websocket_event, {})

        # Assert
        assert response["statusCode"] == 404
