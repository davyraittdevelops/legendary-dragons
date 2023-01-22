import os
import json
import boto3
import pytest
from moto import mock_dynamodb
from unittest.mock import patch
from boto3.dynamodb.conditions import Key
from datetime import datetime
import botocore.client

CONNECTION_ID = "abcdefg"
TABLE_NAME = "test_wishlist"
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
            "action": "getWishlistReq"
        }),
    }

orig = botocore.client.BaseClient._make_api_call

def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "PostToConnection":
        return None
    return orig(self, operation_name, kwarg)

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lamda_handler_success(websocket_event, table_definition):
    # Arrange
    # 1. Create the DynamoDB Table
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)

    now = datetime.utcnow().isoformat()
    user_pk = "USER#user-123"

    table.put_item(Item={
        "PK": user_pk,
        "SK": "WISHLIST_ITEM#1",
        "entity_type": "WISHLIST_ITEM",
        "created_at": now,
        "last_modified": now,
        "cardmarked_id": "1",
        "card_name": "Black Lotus",
        "orcale_id": "1",
        "user_id": "user-123",
        "wishlist_item_id": "1",
        "GSI1_PK": "WISHLIST_ITEM#1",
        "GSI1_SK": user_pk,
        "GSI2_PK": "DECK#1",
        "GSI2_SK": "WISHLIST_ITEM#1"
    })

    table.put_item(Item={
        "PK": user_pk,
        "SK": "WISHLIST_ITEM#2",
        "entity_type": "WISHLIST_ITEM",
        "created_at": now,
        "last_modified": now,
        "cardmarked_id": "2",
        "card_name": "Sword of Doom",
        "orcale_id": "2",
        "user_id": "user-123",
        "wishlist_item_id": "2",
        "GSI1_PK": "WISHLIST_ITEM#2",
        "GSI1_SK": user_pk,
        "GSI2_PK": "DECK#1",
        "GSI2_SK": "WISHLIST_ITEM#2"
    })

    # Act
    with patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call):
        from functions.get_wishlist import app
        response = app.lambda_handler(websocket_event, {})

        wishlist_items = table.query(
            KeyConditionExpression=Key("PK").eq("USER#user-123") &
            Key("SK").begins_with("WISHLIST")
        )["Items"]

        # Assert
        assert response["statusCode"] == 200

        # Black Lotus
        assert wishlist_items[0]["SK"] == "WISHLIST_ITEM#1"
        assert wishlist_items[0]["entity_type"] == "WISHLIST_ITEM"
        assert wishlist_items[0]["cardmarked_id"] == "1"
        assert wishlist_items[0]["card_name"] == "Black Lotus"
        assert wishlist_items[0]["orcale_id"] == "1"
        assert wishlist_items[0]["user_id"] == "user-123"
        assert wishlist_items[0]["wishlist_item_id"] == "1"
        assert wishlist_items[0]["GSI2_PK"] == "DECK#1"

        # Sword of Doom
        assert wishlist_items[1]["SK"] == "WISHLIST_ITEM#2"
        assert wishlist_items[1]["entity_type"] == "WISHLIST_ITEM"
        assert wishlist_items[1]["cardmarked_id"] == "2"
        assert wishlist_items[1]["card_name"] == "Sword of Doom"
        assert wishlist_items[1]["orcale_id"] == "2"
        assert wishlist_items[1]["user_id"] == "user-123"
        assert wishlist_items[1]["wishlist_item_id"] == "2"
        assert wishlist_items[1]["GSI2_PK"] == "DECK#1"
