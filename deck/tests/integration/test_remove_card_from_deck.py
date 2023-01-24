import os
import json
from decimal import Decimal

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
def websocket_deck_event():
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
      "action": "removeCardFromDeckReq",
      "inventory_id": "456",
      "deck_id": "123",
      "deck_card": {
        "card_name": "Swords of Doom",
        "inventory_card_id": "1",
        "colors": ["R"],
        "inventory_id": "123",
        "entity_type": "DECK_CARD",
        "prices": {"eur": None, "usd_foil": None, "usd": "0.05", "usd_etched": None, "eur_foil": None, "tix": None},
        "rarity": "meta",
        "quality": "rare",
        "image_url": "example-image-url.com",
      }
    }),
  }

@pytest.fixture()
def websocket_side_deck_event():
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
        "action": "removeCardFromDeckReq",
        "inventory_id": "456",
        "deck_id": "123",
        "deck_card": {
          "card_name": "Swords of Hounds",
          "inventory_card_id": "2",
          "colors": ["R"],
          "inventory_id": "123",
          "entity_type": "SIDE_DECK_CARD",
          "prices": {"eur": None, "usd_foil": None, "usd": "0.10", "usd_etched": None, "eur_foil": None, "tix": None},
          "rarity": "meta",
          "quality": "rare",
          "image_url": "example-image-url.com",
        }
      }),
    }

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
@mock_events
@mock_sqs
def test_lamda_handler_success(websocket_deck_event, table_definition):
  # Arrange
  # 1. Create the DynamoDB Table
  dynamodb = boto3.resource("dynamodb")
  table = dynamodb.create_table(**table_definition)

  table.put_item(Item={
    "PK": "USER#user-123",
    "SK": "DECK#123",
    "total_value": {
      "usd": 14,
      "usd_foil": 0,
      "usd_etched": 0,
      "eur": 0,
      "eur_foil": 0,
      "tix": 0
    },
    "is_valid": True
  })

  table.put_item(
    Item={
      "PK": "USER#user-123",
      "SK": "DECK#123#DECK_CARD#1",
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
      "GSI1_PK": "DECK#123#DECK_CARD#2",
      "GSI1_SK": "USER#user-123",
      "user_id": "user-123"
    }
  )

  # Act
  from functions.remove_card_from_deck import app
  response = app.lambda_handler(websocket_deck_event, {})

  deck_cards = table.query(
      KeyConditionExpression=Key("PK").eq("USER#user-123") &
                             Key("SK").begins_with("DECK#123#DECK_CARD")
  )["Items"]

  deck = table.query(
      KeyConditionExpression=Key("PK").eq("USER#user-123") &
                             Key("SK").eq("DECK#123"),
  )["Items"][0]

  # Assert
  assert response["statusCode"] == 200
  assert len(deck_cards) == 0

  total_values = deck["total_value"]
  assert total_values["usd"] == Decimal("13.95")
  assert total_values["usd_foil"] == 0
  assert total_values["usd_etched"] == 0
  assert total_values["eur"] == 0
  assert total_values["eur_foil"] == 0
  assert total_values["tix"] == 0

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
@mock_events
@mock_sqs
def test_lamda_handler_sidedeck(websocket_side_deck_event, table_definition):
  # Arrange
  # 1. Create the DynamoDB Table
  dynamodb = boto3.resource("dynamodb")
  table = dynamodb.create_table(**table_definition)

  table.put_item(Item={
    "PK": "USER#user-123",
    "SK": "DECK#123",
    "total_value": {
      "usd": 14,
      "usd_foil": 0,
      "usd_etched": 0,
      "eur": 0,
      "eur_foil": 0,
      "tix": 0
    },
    "is_valid": True
  })

  table.put_item(
    Item={
      "PK": "USER#user-123",
      "SK": "DECK#123#DECK_CARD#2",
      "entity_type": "SIDE_DECK_CARD",
      "deck_id": "123",
      "inventory_id": "123",
      "inventory_card_id": "2",
      "created_at": "2023-01-17T23:45:18.666453",
      "last_modified": "2023-01-17T23:45:18.666453",
      "card_name": "Swords of Hounds",
      "colors": ["R"],
      "prices": {"usd": "0.10"},
      "rarity": "meta",
      "quality": "rare",
      "image_url": "example-image-url.com",
      "GSI1_PK": "DECK#123#DECK_CARD#2",
      "GSI1_SK": "USER#user-123",
      "user_id": "user-123"
    }
  )
  
  # Act
  from functions.remove_card_from_deck import app
  response = app.lambda_handler(websocket_side_deck_event, {})

  side_deck_cards = table.query(
      KeyConditionExpression=Key("PK").eq("USER#user-123") &
                             Key("SK").begins_with("DECK#123#DECK_CARD")
  )["Items"]

  # Assert
  assert response["statusCode"] == 200
  assert len(side_deck_cards) == 0
