import os
import json
import boto3
import pytest
from moto import mock_dynamodb
from unittest.mock import patch
from boto3.dynamodb.conditions import Key
from datetime import datetime

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
def websocket_price_event():
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
            "action": "removeAlertReq",
            "wishlist_item_id": "1", 
            "alert_item": {
                "entity_type": "ALERT#PRICE",
                "price_point": "5.00",
                "user_id": "user-123",
                "wishlist_item_id": "1",
                "alert_id": "1",
                "card_market_id": "1"
            }
        }),
    }

@pytest.fixture()
def websocket_availability_event():
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
            "action": "removeAlertReq",
            "wishlist_item_id": "1", 
            "alert_item": {
                "entity_type": "ALERT#AVAILABILITY",
                "user_id": "user-123",
                "wishlist_item_id": "1",
                "alert_id": "1",
                "card_market_id": "1"
            }
        }),
    }

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lamda_handler_price_success(websocket_price_event, table_definition):
    # Arrange
    # 1. Create the DynamoDB Table
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)

    now = datetime.utcnow().isoformat()
    user_pk = "USER#user-123"
    wishlist_item_alert_sk = "WISHLIST_ITEM#1#ALERT#PRICE#1"

    table.put_item(Item={
        "PK": user_pk,
        "SK": wishlist_item_alert_sk,
        "entity_type": "ALERT#PRICE",
        "created_at": now,
        "last_modified": now,
        "price_point": "5.00",
        "alert_id": "1",
        "user_id": "user-123",
        "GSI1_PK": wishlist_item_alert_sk,
        "GSI1_SK": user_pk,
        "wishlist_item_id": "1"
    })

    # Act
    from functions.remove_alert import app
    response = app.lambda_handler(websocket_price_event, {})

    wishlist_price = table.query(
        KeyConditionExpression=Key("PK").eq("USER#user-123") &
        Key("SK").begins_with("WISHLIST_ITEM#1#ALERT#PRICE")
    )["Items"]

    # Assert
    assert response["statusCode"] == 200
    assert len(wishlist_price) == 0


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lamda_handler_availability_success(websocket_availability_event, table_definition):
    # Arrange
    # 1. Create the DynamoDB Table
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)

    now = datetime.utcnow().isoformat()
    user_pk = "USER#user-123"
    wishlist_item_alert_sk = "WISHLIST_ITEM#1#ALERT#AVAILABILITY#1"

    table.put_item(Item={
        "PK": user_pk,
        "SK": wishlist_item_alert_sk,
        "entity_type": "ALERT#AVAILABILITY",
        "created_at": now,
        "last_modified": now,
        "alert_id": "1",
        "user_id": "user-123",
        "GSI1_PK": wishlist_item_alert_sk,
        "GSI1_SK": user_pk
    })

    # Act
    from functions.remove_alert import app
    response = app.lambda_handler(websocket_availability_event, {})

    wishlist_availability_alerts = table.query(
        KeyConditionExpression=Key("PK").eq("USER#user-123") &
        Key("SK").begins_with("WISHLIST_ITEM#1#ALERT#AVAILABILITY")
    )["Items"]

    # Assert
    assert response["statusCode"] == 200
    assert len(wishlist_availability_alerts) == 0
