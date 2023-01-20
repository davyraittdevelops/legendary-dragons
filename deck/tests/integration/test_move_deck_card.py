import os
import json
import pytest
import boto3
from moto import mock_dynamodb, mock_events, mock_sqs
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
      "action": "moveDeckCardReq",
      "deck_card": "DECK_CARD#1",
      "deck_id": "DECK#123"
    }),
  }

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
@mock_events
@mock_sqs
def test_lamda_handler_success(websocket_event, table_definition):
  # Arrange
  # 1. Create the DynamoDB Table
  dynamodb = boto3.resource("dynamodb")
  table = dynamodb.create_table(**table_definition)

  table.put_item(
    Item={
      "PK": "DECK_CARD#1",
      "SK": "DECK#123",
      "entity_type": "DECK_CARD",
      "deck_id": "123",
      "inventory_id": "123",
      "inventory_card_id": "1",
      "created_at": "2023-01-17T23:45:18.666453",
      "last_modified": "2023-01-17T23:45:18.666453",
      "card_name": "Swords of Doom",
      "colors": ["R"],
      "prices": {"usd": "0.05"},
      "rarity": "meta",
      "quality": "rare",
      "image_url": "example-image-url.com",
      "GSI1_PK": "DECK#123",
      "GSI1_SK": "DECK_CARD#1",
      "user_id": "user-123"
    }
  )

  # Act
  from functions.move_deck_card import app
  response = app.lambda_handler(websocket_event, {})

  deck_card = table.query(
      KeyConditionExpression=Key("GSI1_PK").eq("DECK#123") &
                             Key("GSI1_SK").begins_with("DECK_CARD"),
      IndexName="GSI1"
  )["Items"]
  
  side_deck_card = table.query(
      KeyConditionExpression=Key("GSI1_PK").eq("DECK#123#SIDE_DECK") &
                             Key("GSI1_SK").begins_with("DECK_CARD"),
      IndexName="GSI1"
  )["Items"]

  # Assert
  assert response["statusCode"] == 200
  assert len(deck_card) == 0
  assert len(side_deck_card) == 1