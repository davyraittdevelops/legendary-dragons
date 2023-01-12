import os
import json
import pytest
import boto3
from moto import mock_dynamodb
from boto3.dynamodb.conditions import Key
from unittest.mock import patch

TABLE_NAME = "test_inventory"
OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY":  "True",
    "TABLE_NAME": TABLE_NAME
}


@pytest.fixture()
def bus_event():
    return {
        "source": "legdragons.identity-and-access.signup",
        "detail-type": "USER_REGISTERED",
        "detail": {
            "user_id": "1234"
        }
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
def test_lambda_handler(bus_event, table_definition):
    # Arrange
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)

    # Act
    from functions.create_inventory import app
    response = app.lambda_handler(bus_event, {})

    inventory = table.query(
        KeyConditionExpression=Key("GSI1_PK").eq("USER#1234") &
        Key("GSI1_SK").begins_with("INVENTORY"),
        IndexName="GSI1"
    )["Items"][0]

    # Assert
    assert response["statusCode"] == 200
    assert inventory["user_id"] == "1234"
    assert inventory["entity_type"] == "INVENTORY"
