import os
import json
import boto3
import pytest
from moto import mock_dynamodb
from unittest.mock import patch
from boto3.dynamodb.conditions import Key

CONNECTION_ID = "abcdefg"
TABLE_NAME = "test_deck"
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
            "action": "removeDeckReq",
            "deck_id": "f98dbd12-8b58-4aa7-8f0a-3f0e7eb55b27"
        }),
    }


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lamda_handler_success(websocket_event, table_definition):
    # Arrange
    # 1. Create the DynamoDB Table
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)
    user_pk = "USER#user-123"
    deck_sk = "DECK#f98dbd12-8b58-4aa7-8f0a-3f0e7eb55b27"

    table.put_item(
      Item={
          "PK": user_pk,
          "SK": deck_sk,
          "entity_type": "DECK",
          "created_at": "2023-18-01",
          "last_modified": "2023-18-01",
          "deck_id": "123",
          "deck_name": "Azorius Soldiers",
          "deck_type": "EDH",
          "user_id": "1",
          "GSI1_PK": deck_sk,
          "GSI1_SK": user_pk,
          "total_value": "0"
      }
    )

    # Act
    from functions.remove_deck import app
    response = app.lambda_handler(websocket_event, {})

    decks = table.query(
        KeyConditionExpression=Key("PK").eq(user_pk) &
        Key("SK").begins_with("DECK"),
    )["Items"]

    # Assert
    assert response["statusCode"] == 200
    assert len(decks) == 0
