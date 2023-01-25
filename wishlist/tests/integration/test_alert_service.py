import os
import json
import boto3
import pytest
from moto import mock_dynamodb, mock_sqs
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
    "CARD_ALERT_QUEUE": "test-output-queue",
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


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_dynamodb
@mock_sqs
def test_lamda_handler(table_definition):
    # Arrange
    sqs = boto3.resource("sqs")
    queue = sqs.create_queue(QueueName=OS_ENV["CARD_ALERT_QUEUE"])
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)

    now = datetime.utcnow().isoformat()
    user_pk = "USER#user-123"

    table.put_item(Item={
        "PK": user_pk,
        "SK": "WISHLIST_ITEM#1#ALERT#PRICE#1",
        "entity_type": "ALERT#PRICE",
        "created_at": now,
        "last_modified": now,
        "alert_id": "1",
        "user_id": "user-123",
        "GSI1_PK": "WISHLIST_ITEM#1#ALERT#PRICE#1",
        "GSI1_SK": user_pk
    })

    table.put_item(Item={
        "PK": user_pk,
        "SK": "WISHLIST_ITEM#1#ALERT#AVAILABILITY#2",
        "entity_type": "ALERT#AVAILABILITY",
        "created_at": now,
        "last_modified": now,
        "alert_id": "2",
        "user_id": "user-123",
        "GSI1_PK": "WISHLIST_ITEM#1#ALERT#AVAILABILITY#2",
        "GSI1_SK": user_pk
    })

    # Act
    from functions.alert_service import app
    response = app.lambda_handler({}, {})
    messages = queue.receive_messages(MaxNumberOfMessages=2)

    assert response["statusCode"] == 200
    assert len(messages) == 2
