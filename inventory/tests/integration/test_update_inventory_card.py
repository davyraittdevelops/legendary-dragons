import json
import os
from unittest.mock import patch
import boto3
import pytest
from boto3.dynamodb.conditions import Key
from moto import mock_dynamodb

CONNECTION_ID = "abcdefg"
TABLE_NAME = "test_inventories"
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
def bus_event():
  return {
    "source": "legdragons.decks.add_card_to_deck",
    "detail-type": "CARD_ADDED_TO_DECK",
    "detail": {
      "inventory_card": {
        "PK": "USER#1",
        "SK": "INVENTORY#1#INVENTORY_CARD#1",
        "entity_type": "INVENTORY_CARD",
        "card_name": "Swords of Doom",
        "card_id": "1",
        "user_id": "1",
        "inventory_id": "123",
        "oracle_id": "oracle-123",
        "colors": ["R"],
        "prices": {"usd": "0.05"},
        "rarity": "meta",
        "quality": "rare",
        "scryfall_id": "scryfall-1",
        "image_url": "example-image-url.com",
        "deck_location": "deck-1",
        "GSI1_PK": "INVENTORY#1#INVENTORY_CARD#1",
        "GSI1_SK": "USER#1",
      }
    }
  }

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lamda_handler_update_card_deck_location(bus_event, table_definition):
  # Arrange
  # 1. Create the DynamoDB Table
  dynamodb = boto3.resource("dynamodb")
  table = dynamodb.create_table(**table_definition)
  user_pk = "USER#1"
  inventory_card_sk = "INVENTORY#1#INVENTORY_CARD#1"

  table.put_item(Item={
    "PK": user_pk,
    "SK": inventory_card_sk,
    "entity_type": "INVENTORY_CARD",
    "card_name": "Swords of Doom",
    "card_id": "1",
    "user_id": "1",
    "inventory_id": "123",
    "oracle_id": "oracle-123",
    "colors": ["R"],
    "prices": {"usd": "0.05"},
    "rarity": "meta",
    "quality": "rare",
    "scryfall_id": "scryfall-1",
    "image_url": "example-image-url.com",
    "deck_location": "unassigned",
    "GSI1_PK": inventory_card_sk,
    "GSI1_SK": user_pk
  })
  # Act
  from functions.update_inventory_card import app
  response = app.lambda_handler(bus_event, {})

  inventory_cards = table.query(
      KeyConditionExpression=Key("PK").eq(user_pk) &
                             Key("SK").begins_with("INVENTORY")
  )["Items"]

  # Assert
  assert response["statusCode"] == 200
  assert len(inventory_cards) == 1
  assert inventory_cards[0]["card_id"] == "1"
  assert inventory_cards[0]["entity_type"] == "INVENTORY_CARD"
  assert inventory_cards[0]["deck_location"] == "deck-1"

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lamda_handler_update_card_deck_location(bus_event, table_definition):
  # Arrange
  # 1. Create the DynamoDB Table
  dynamodb = boto3.resource("dynamodb")
  dynamodb.create_table(**table_definition)

  # Act
  from functions.update_inventory_card import app
  response = app.lambda_handler(bus_event, {})

  # Assert
  assert response["statusCode"] == 400
  assert json.loads(response["body"])["message"] == "The conditional request failed"
