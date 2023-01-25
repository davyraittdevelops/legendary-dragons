import os
import pytest
import boto3
from moto import mock_events
from unittest.mock import patch
from moto import mock_dynamodb
from moto import mock_cognitoidp
from moto import mock_ses
from moto.core import DEFAULT_ACCOUNT_ID
from moto.ses import ses_backends
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY":  "True",
    "TESTING":  "True",
    "EVENT_BUS_NAME": "test-event-bus",
    "TABLE_NAME": "cards",
    "COGNITO_CLIENT": ""
 }


@pytest.fixture()
def table_definition():
    return {
        "TableName": 'cards',
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
def event():
    return {'Records': [{ 'body': '{"created_at": "2023-01-24T12:58:18.240549", "entity_type": "ALERT#PRICE", "wishlist_item_id": "c6adf95f-7ebb-4e18-959b-42aa71c3961f", "user_id": "0d62b27d-772a-4895-987c-19ae4fd7fb9f", "alert_id": "23d4f436-a417-4a26-b5b8-c698f11a186b", "card_name": "Acid Web Spider", "price_point": "10", "GSI1_SK": "USER0d62b27d-772a-4895-987c-19ae4fd7fb9f", "SK": "WISHLIST_ITEM#c6adf95f-7ebb-4e18-959b-42aa71c3961f#ALERT#PRICE#23d4f436-a417-4a26-b5b8-c698f11a186b", "PK": "USER#0d62b27d-772a-4895-987c-19ae4fd7fb9f", "last_modified": "2023-01-24T12:58:18.240549", "card_market_id": "242799", "GSI1_PK": "WISHLIST_ITEM#c6adf95f-7ebb-4e18-959b-42aa71c3961f#ALERT#PRICE#23d4f436-a417-4a26-b5b8-c698f11a186b"}'}]}


def cognito_pool():
    cognito_client = boto3.client("cognito-idp")

    user_pool_id = cognito_client.create_user_pool(
        PoolName="LegDragonUserPool"
    )["UserPool"]["Id"]

    os.environ["COGNITO_CLIENT"] = user_pool_id

    app_client = cognito_client.create_user_pool_client(
        UserPoolId=user_pool_id, ClientName="LegDragonUserPool"
    )

    return {
        "app_client": app_client,
        "client": cognito_client,
        "user_pool_id": user_pool_id
    }


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_events
@mock_dynamodb
@mock_cognitoidp
@mock_ses
def test_lambda_handler(event, table_definition):
    # Arrange
    dynamodb = boto3.resource("dynamodb")
    conn = boto3.client("ses", region_name="us-east-1")
    conn.verify_email_identity(EmailAddress="alerts@legendarydragons.cloud-native-minor.it")

    table = dynamodb.create_table(**table_definition)

    email = "legendary-dragons@example.test.nl"
    password = "Pytest2022!"
    nickname = "Legendary Dragons"

    cognito = cognito_pool()

    client_id = cognito["app_client"]["UserPoolClient"]["ClientId"]

    os.environ["APP_CLIENT_ID"] = client_id

    os.environ["USERPOOL_ID"] = "someuserpoolid"

    cognito["client"].sign_up(
        ClientId=client_id,
        Username=email,
        Password=password,
        UserAttributes=[
            {"Name": "email", "Value": email},
            {"Name": "nickname", "Value": nickname}
        ]
    )
    cognito["client"].admin_confirm_sign_up(
        UserPoolId=cognito["user_pool_id"], Username=email
    )
    replaced_record = event['Records'][0]['body'].replace('0d62b27d-772a-4895-987c-19ae4fd7fb9f', email)
    event['Records'][0]['body'] = replaced_record

    table.put_item(Item={
        "PK": "CARD#968a25a5-9ec1-47fa-bf1f-e65eb75fdb00",
        "SK": "CARD_FACE#23d4f436-a417-4a26-b5b8-c698f11a186b",
        "card_name": "Acid Web Spider",
        "entity_type": "CARD",
        "GSI1_PK": "CARD_FACE#23d4f436-a417-4a26-b5b8-c698f11a186b",
        "GSI1_SK": "CARD#968a25a5-9ec1-47fa-bf1f-e65eb75fdb00",
        "oracle_id": "23d4f436-a417-4a26-b5b8-c698f11a186b",
        "prices": {"eur": "0.20"}
    })

    logger.info(ses_backends[DEFAULT_ACCOUNT_ID].keys())
    ses_backend = ses_backends[DEFAULT_ACCOUNT_ID]['global']

    # Act
    from functions.process_card_alert import app
    response = app.lambda_handler(event, {})

    # sent_messages is a List of Message objects
    messages = ses_backend.sent_messages
    message = messages.pop()

    # Assert
    assert response["statusCode"] == 201
    assert message.body == 'Congratulations! The price alert for the card Acid Web Spider has been triggered. The current card price is 0.20 eur and your alert price value was set to 10.0'
