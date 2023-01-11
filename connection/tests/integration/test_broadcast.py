import json
from unittest.mock import patch
import os
import boto3
import botocore
import pytest
from moto import mock_dynamodb

TABLE_NAME = "connections"
OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_SESSION_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY": "True",
    "TABLE_NAME": TABLE_NAME
}

CONNECTIONS = ["1"]


@pytest.fixture()
def stream_event():
    return {
        "detail-type": "REMOVE", "source": "inventory.database",
        "resources": ["arn:aws:dynamodb:us-east-1:861259332787:table/inventories"],
        "detail": {
            "eventID": "980ac8c998859b126e067e21a11d0aa6",
            "eventName": "REMOVE", "eventSource": "aws:dynamodb",
            "dynamodb": {
                "ApproximateCreationDateTime": 1673459333.0,
                "Keys": {
                    "SK": {
                        "S": "INVENTORY#5a838611-4e0d-4fde-b481-8b288d77937f"
                    },
                    "PK": {
                        "S": "INVENTORY_CARD#bcd4fcd8-bea7-4f1b-b1d3-95efcd8db09a"
                    }
                },
                "OldImage": {
                    "entity_type": {
                        "S": "INVENTORY_CARD"
                    },
                    "user_id": {
                        "S": "47b398db-dac8-4ed9-8098-7018009c319e"
                    },
                    "inventory_id": {
                        "S": "5a838611-4e0d-4fde-b481-8b288d77937f"
                    },
                    "SK": {
                        "S": "INVENTORY#5a838611-4e0d-4fde-b481-8b288d77937f"
                    },
                    "card_name": {
                        "S": "test"
                    },
                    "created_at": {
                        "S": "2023-01-11T17:47:26.220777"
                    },
                    "GSI1_SK": {
                        "S": "INVENTORY_CARD#bcd4fcd8-bea7-4f1b-b1d3-95efcd8db09a"
                    },
                    "PK": {
                        "S": "INVENTORY_CARD#bcd4fcd8-bea7-4f1b-b1d3-95efcd8db09a"
                    },
                    "last_modified": {
                        "S": "2023-01-11T17:47:26.220777"
                    },
                    "card_id": {
                        "S": "bcd4fcd8-bea7-4f1b-b1d3-95efcd8db09a"
                    },
                    "GSI1_PK": {
                        "S": "INVENTORY#5a838611-4e0d-4fde-b481-8b288d77937f"
                    }
                },
                "SequenceNumber": "9587300000000041995332089",
                "SizeBytes": 560,
                "StreamViewType": "NEW_AND_OLD_IMAGES"
            }
        }
    }


orig = botocore.client.BaseClient._make_api_call


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "PostToConnection":
        return None
    return orig(self, operation_name, kwarg)



@pytest.fixture()
def table_definition():
    return {
        "TableName": TABLE_NAME,
        "AttributeDefinitions": [
            {"AttributeName": "PK", "AttributeType": "S"},
            {"AttributeName": "SK", "AttributeType": "S"},
            {"AttributeName": "GSI1_PK", "AttributeType": "S"},
            {"AttributeName": "GSI1_SK", "AttributeType": "S"},
        ],
        "KeySchema": [
            {"AttributeName": "PK", "KeyType": "HASH"},
            {"AttributeName": "SK", "KeyType": "RANGE"}
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
def test_lambda_handler(stream_event, table_definition):
    # Arrange
    user_id = "47b398db-dac8-4ed9-8098-7018009c319e47b398db-dac8-4ed9-8098-7018009c319e"
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)
    for connection_id in CONNECTIONS:
        table.put_item(
            Item={
                "PK": f"CONNECTION#{connection_id}",
                "SK": f"USER#{user_id}",
                "entity_type": "CONNECTION",
                "domain": "localhost.websockets.com",
                "stage": "Prod",
                "GSI1_PK": f"USER#{user_id}",
                "GSI1_SK": f"CONNECTION#{connection_id}"
            }
        )

    with patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call):
        # Act
        from functions.broadcast import app
        response = app.lambda_handler(stream_event, {})

        # Assert
        assert response["statusCode"] == 200
