import os
import json
import botocore.client
import boto3
import pytest
from moto import mock_dynamodb
from unittest.mock import patch
from boto3.dynamodb.conditions import Key
from datetime import datetime

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
            "action": "removeCardToInventoryReq",
            "inventory_card_id": "1",
            "inventory_id": "inv-12",
            
        }),
    }


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lamda_handler_success(websocket_event, table_definition):
    # Arrange
    # 1. Create the DynamoDB Table
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)
    now = datetime.utcnow().isoformat()

    table.put_item(Item={
        "PK": "USER#user-123",
        "SK": "INVENTORY#inv-12#INVENTORY_CARD#1",
        "entity_type": "INVENTORY_CARD",
        "inventory_id": "inv-12",
        "user_id": "user-123",
        "card_id": "d99a9a7d-d9ca-4c11-80ab-e39d5943a315",
        "created_at": now,
        "last_modified": now,
        "GSI1_PK": "INVENTORY#inv-12#INVENTORY_CARD#1",
        "GSI1_SK": "USER#user-123"
    })

    # Act
    from functions.remove_card_from_inventory import app
    response = app.lambda_handler(websocket_event, {})

    inventory_card = table.query(
        KeyConditionExpression=Key("PK").eq("USER#user-123") &
        Key("SK").begins_with("INVENTORY")
    )["Items"]

    # Assert
    assert response['statusCode'] == 200
    assert len(inventory_card) == 0
