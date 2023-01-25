import os
import json
from decimal import Decimal

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
            "action": "addCardToInventoryReq",
            "inventory_id": "inv-12",
            "inventory_card": {
                "card_name": "Swords of Doom", "oracle_id": "oracle-123",
                "colors": ["R"], "prices": {"usd": "0.05", "usd_foil": None, "usd_etched": None, "tix": None, "eur": None, "eur_foil": None},
                "rarity": "meta", "quality": "rare",
                "scryfall_id": "scryfall-1"
            }
        }),
    }


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lamda_handler_success(websocket_event, table_definition):
    # Arrange
    # 1. Create the DynamoDB Table
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)
    table.put_item(Item={
        "PK": "USER#user-123",
        "SK": "INVENTORY#inv-12",
        "total_value": {
            "usd": Decimal("14.13"),
            "usd_foil": 0,
            "usd_etched": 0,
            "eur": 0,
            "eur_foil": 0,
            "tix": 0
        },
        "total_cards": 50
    })

    # Act
    from functions.add_card_to_inventory import app
    response = app.lambda_handler(websocket_event, {})

    inventory_card = table.query(
        KeyConditionExpression=Key("PK").eq("USER#user-123") &
        Key("SK").begins_with("INVENTORY#inv-12#INVENTORY_CARD"),
    )["Items"][0]

    inventory = table.query(
        KeyConditionExpression=Key("PK").eq("USER#user-123") &
                               Key("SK").eq("INVENTORY#inv-12")
    )["Items"][0]

    # Assert
    assert response["statusCode"] == 200
    assert inventory_card["inventory_id"] == "inv-12"
    assert inventory_card["entity_type"] == "INVENTORY_CARD"

    total_values = inventory["total_value"]
    assert total_values["usd"] == Decimal("14.18")
    assert total_values["usd_foil"] == 0
    assert total_values["usd_etched"] == 0
    assert total_values["eur"] == 0
    assert total_values["eur_foil"] == 0
    assert total_values["tix"] == 0
    assert inventory["total_cards"] == "51"
