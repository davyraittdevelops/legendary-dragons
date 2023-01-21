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
            "action": "createWishlistItemReq",
            "deck_id": "",
            "wishlist_item": {
                "oracle_id": "1",
                "image_url" : "https//img.png",
                "cardmarket_id": "1",
                "card_name": "Swords of Doom"
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

    # Act
    from functions.create_wishlist_item import app
    response = app.lambda_handler(websocket_event, {})

    wishlist_item = table.query(
        KeyConditionExpression=Key("PK").eq("USER#user-123") &
        Key("SK").begins_with("WISHLIST")
    )["Items"][0]

    # Assert
    print(wishlist_item)
    assert response["statusCode"] == 200
    assert wishlist_item["entity_type"] == "WISHLIST_ITEM"
    assert wishlist_item["oracle_id"] == "1"
    assert wishlist_item["image_url"] == "https//img.png"
    assert wishlist_item["card_market_id"] == "1"
    assert wishlist_item["card_name"] == "Swords of Doom"
