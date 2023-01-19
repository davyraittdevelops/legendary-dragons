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

  
  table.put_item(
      Item={
          "PK": "DECK_CARD#1232",
          "SK": "DECK#123",
          "entity_type": "DECK_CARD",
          "deck_id": "123",
          "inventory_id": '1',
          "inventory_card_id": '1',
          "created_at":'today',
          "last_modified": 'just now',
          "card_name": 'obelisk the tormentor',
          "colors": 'red',
          "prices": '100eur',
          "rarity": 'veryrare',
          "quality": 'good',
          "image_url": 'https://img',
          "GSI1_PK": "DECK#123",
          "GSI1_SK": "DECK_CARD#1232",
      }
  )

  # Act
  with patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call):
    from functions.get_deck import app
    response = app.lambda_handler(websocket_event, {})

    deck_cards = table.query(
        KeyConditionExpression=Key("GSI1_PK").eq("DECK#123") &
                              Key("GSI1_SK").begins_with("DECK_CARD"),
        IndexName="GSI1"
    )["Items"]

    # Assert
    assert response["statusCode"] == 200
    assert len(deck_cards) == 1
    assert deck_cards[0]['PK'] == 'DECK_CARD#1232'
    assert deck_cards[0]['SK'] == 'DECK#123'
    assert deck_cards[0]['entity_type'] == 'DECK_CARD'
    assert deck_cards[0]['deck_id'] == '123'
    assert deck_cards[0]['inventory_id'] == '1'
    assert deck_cards[0]['created_at'] == 'today'
    assert deck_cards[0]['last_modified'] == 'just now'
    assert deck_cards[0]['card_name'] == 'obelisk the tormentor'
    assert deck_cards[0]['colors'] == 'red'
    assert deck_cards[0]['prices'] == '100eur'
    assert deck_cards[0]['rarity'] == 'veryrare'
    assert deck_cards[0]['quality'] == 'good'
    assert deck_cards[0]['image_url'] == 'https://img'
    assert deck_cards[0]['GSI1_PK'] == 'DECK#123'