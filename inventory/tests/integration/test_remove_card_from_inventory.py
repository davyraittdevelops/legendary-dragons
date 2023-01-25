import os
import json
from decimal import Decimal

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

    user_pk = "USER#user-123"
    inventory_card_sk = "INVENTORY#inv-12#INVENTORY_CARD#1"

    table.put_item(Item={
        "PK": user_pk,
        "SK": "INVENTORY#inv-12",
        "total_value": {
            "usd": 0,
            "usd_foil": 0,
            "usd_etched": 0,
            "eur": 24,
            "eur_foil": 0,
            "tix": 0
        },
    })

    table.put_item(Item={
        "PK": user_pk,
        "SK": inventory_card_sk,
        "entity_type": "INVENTORY_CARD",
        "inventory_id": "inv-12",
        "user_id": "user-123",
        "card_id": "1",
        "prices": {'usd_foil': None, 'usd_etched': None, 'eur_foil': None, 'tix': None, 'eur': '1.98', 'usd': '2.18'},
        "created_at": now,
        "last_modified": now,
        "GSI1_PK": inventory_card_sk,
        "GSI1_SK": user_pk
    })

    # Act
    from functions.remove_card_from_inventory import app
    response = app.lambda_handler(websocket_event, {})

    inventory_card = table.query(
        KeyConditionExpression=Key("PK").eq(user_pk) &
        Key("SK").begins_with("INVENTORY#inv-12#INVENTORY_CARD#")
    )["Items"]

    inventory = table.query(
        KeyConditionExpression=Key("PK").eq(user_pk) &
        Key("SK").eq("INVENTORY#inv-12")
    )["Items"][0]

    # Assert
    assert response['statusCode'] == 200
    assert len(inventory_card) == 0

    total_values = inventory["total_value"]
    assert total_values["usd"] == 0
    assert total_values["usd_foil"] == 0
    assert total_values["usd_etched"] == 0
    assert total_values["eur"] == Decimal("22.02")
    assert total_values["eur_foil"] == 0
    assert total_values["tix"] == 0


