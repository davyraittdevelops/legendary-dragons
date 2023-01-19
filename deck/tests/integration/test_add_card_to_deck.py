import os
import json
import boto3
import pytest
from moto import mock_dynamodb, mock_events, mock_sqs
from unittest.mock import patch
from boto3.dynamodb.conditions import Key

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
      "action": "addCardToDeckReq",
      "deck_type": "deck",
      "deck_id": "123",
      "inventory_card": {
        "card_name": "Swords of Doom",
        "card_id": "1",
        "inventory_id": "123",
        "oracle_id": "oracle-123",
        "colors": ["R"],
        "prices": {"usd": "0.05"},
        "rarity": "meta",
        "quality": "rare",
        "scryfall_id": "scryfall-1",
        "image_url": "example-image-url.com",
      }
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

  # 2. Create SQS and EventBridge
  sqs = boto3.resource("sqs")
  queue = sqs.create_queue(QueueName="test-output-queue")
  client = boto3.client("events")
  client.create_event_bus(Name=OS_ENV["EVENT_BUS_NAME"])
  client.put_rule(
      Name="test-rule", EventBusName=OS_ENV["EVENT_BUS_NAME"],
      EventPattern=json.dumps(
          {
            "detail-type": ["CARD_ADDED_TO_DECK"],
            "source": ["legdragons.decks.add_card_to_deck"]
          }
      )
  )
  client.put_targets(
      Rule="test-rule", EventBusName=OS_ENV["EVENT_BUS_NAME"],
      Targets=[{
        "Id": "testing-target",
        "Arn": queue.attributes.get("QueueArn")
      }]
  )

  # Act
  from functions.add_card_to_deck import app
  response = app.lambda_handler(websocket_event, {})
  messages = queue.receive_messages(MaxNumberOfMessages=2)
  stream_message = json.loads(messages[0].body)

  deck_card = table.query(
      KeyConditionExpression=Key("GSI1_PK").eq("DECK#123") &
                             Key("GSI1_SK").begins_with("DECK_CARD"),
      IndexName="GSI1"
  )["Items"][0]

  # Assert
  assert response["statusCode"] == 200
  assert len(messages) == 1
  assert stream_message["detail-type"] == "CARD_ADDED_TO_DECK"
  assert deck_card
  assert deck_card["deck_id"] == "123"
  assert deck_card["entity_type"] == "DECK_CARD"


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
@mock_events
@mock_sqs
def test_lamda_handler_sidedeck(websocket_event, table_definition):
  # Arrange
  # 1. Create the DynamoDB Table
  dynamodb = boto3.resource("dynamodb")
  table = dynamodb.create_table(**table_definition)

  # 2. Create SQS and EventBridge
  sqs = boto3.resource("sqs")
  queue = sqs.create_queue(QueueName="test-output-queue")
  client = boto3.client("events")
  client.create_event_bus(Name=OS_ENV["EVENT_BUS_NAME"])
  client.put_rule(
      Name="test-rule", EventBusName=OS_ENV["EVENT_BUS_NAME"],
      EventPattern=json.dumps(
          {"detail-type": ["CARD_ADDED_TO_DECK"], "source": ["legdragons.deck.add_card_to_deck"]}
      )
  )
  client.put_targets(
      Rule="test-rule", EventBusName=OS_ENV["EVENT_BUS_NAME"],
      Targets=[{
        "Id": "testing-target",
        "Arn": queue.attributes.get("QueueArn")
      }]
  )
  body = json.loads(websocket_event["body"])
  body["deck_type"] = "side_deck"
  websocket_event["body"] = json.dumps(body)

  # Act
  from functions.add_card_to_deck import app
  response = app.lambda_handler(websocket_event, {})
  messages = queue.receive_messages(MaxNumberOfMessages=2)
  stream_message = json.loads(messages[0].body)

  deck_card = table.query(
      KeyConditionExpression=Key("GSI1_PK").eq("DECK#123#SIDE_DECK") &
                             Key("GSI1_SK").begins_with("DECK_CARD"),
      IndexName="GSI1"
  )["Items"][0]

  # Assert
  assert response["statusCode"] == 200
  assert len(messages) == 1
  assert stream_message["detail-type"] == "CARD_ADDED_TO_DECK"
  assert deck_card
  assert deck_card["deck_id"] == "123"
  assert deck_card["entity_type"] == "DECK_CARD"
  assert deck_card["SK"] == "DECK#123#SIDE_DECK"
