import os
import json
import pytest
import boto3
from moto import mock_events, mock_dynamodb
from unittest.mock import patch
import requests_mock
import botocore.client
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)
TABLE_NAME = "cards"
OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY":  "True",
    "EVENT_BUS_NAME": "test-event-bus",
    "TABLE_NAME": TABLE_NAME
 }

@pytest.fixture()
def stream_event():
    return {
        "Records": [
            {}
        ]
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


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "PostToConnection":
        return None
    return orig(self, operation_name, kwarg)

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
def test_lambda_handler(stream_event, table_definition):
    # Arrange
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)


    # Act
    from functions.update_cards_from_scryfall import app
    response = app.lambda_handler(stream_event, {})
    response = table.scan()

    # Assert
    assert response["Items"][0]['entity_type'] == 'CARD'
    assert response["Items"][0]['GSI1_SK'] == 'CARD#0000579f-7b35-4ed3-b44c-db2a538066fe'
    assert response["Items"][0]['GSI1_PK'] == 'CARD_FACE#44623693-51d6-49ad-8cd7-140505caf02f'
    assert response["Items"][1]['entity_type'] == 'CARD_FACE'
    assert response["Items"][1]['scryfall_id'] == '0000579f-7b35-4ed3-b44c-db2a538066fe'
    assert response["Items"][1]['oracle_id'] == '44623693-51d6-49ad-8cd7-140505caf02f'
