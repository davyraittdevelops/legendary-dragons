import os
import json
import boto3
import pytest
from moto import mock_dynamodb, mock_events, mock_sqs
from unittest.mock import patch
from boto3.dynamodb.conditions import Key
import botocore.client

CONNECTION_ID = "abcdefg"
TABLE_NAME = "test_decks"
OS_ENV = {
  "AWS_ACCESS_KEY_ID": "testing",
  "AWS_SECRET_ACCESS_KEY": "testing",
  "AWS_SECURITY_TOKEN": "testing",
  "AWS_SESSION_TOKEN": "testing",
  "AWS_DEFAULT_REGION": "us-east-1",
  "DISABLE_XRAY": "True",
  "TABLE_NAME": TABLE_NAME,
  "EVENT_BUS_NAME": "test-event-bus"
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
      "action": "getCardsFromDeckReq",
      "deck_id": "123",
    }),
  }

orig = botocore.client.BaseClient._make_api_call

def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "PostToConnection":
        return None
    return orig(self, operation_name, kwarg)

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
@mock_events
@mock_sqs
def test_lamda_handler_success(websocket_event, table_definition):
  # Arrange
  # 1. Create the DynamoDB Table
  dynamodb = boto3.resource("dynamodb")
  table = dynamodb.create_table(**table_definition)

  # Act
  with patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call):
    from functions.get_cards_from_deck import app
    response = app.lambda_handler(websocket_event, {})

    deck_cards = table.query(
        KeyConditionExpression=Key("GSI1_PK").eq("DECK#123") &
                              Key("GSI1_SK").begins_with("DECK_CARD"),
        IndexName="GSI1"
    )["Items"]

    # Assert
    assert response["statusCode"] == 200
    assert len(deck_cards) == 0
