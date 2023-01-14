import os
import json
import botocore.client
import pytest
from moto import mock_dynamodb
from unittest.mock import patch
from boto3.dynamodb.conditions import Key
import requests_mock

CONNECTION_ID = "abcdefg"
SCRYFALL_URL = "https://api.scryfall.com"
OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_SESSION_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY": "True",
    "SCRYFALL_URL": SCRYFALL_URL,
}

@pytest.fixture()
def websocket_event():
    """Generates Websocket Event"""
    return {
        "requestContext": {
            "domainName": "localhost",
            "stage": "Prod",
            "connectionId": CONNECTION_ID
        },
        "body": json.dumps({
            "action": "searchCardsByKeywordReq",
            "query": "Asmoranomardicadaistinaculdacar"
        }),
    }

def searched_cards():
    return {
        "total_cards": 1,
        "data": [
            {
                "object": "card",
                "id": "d99a9a7d-d9ca-4c11-80ab-e39d5943a315",
                "oracle_id": "7b3b5be0-8bec-43c9-bd61-39fd92e0d705",
                "multiverse_ids": [
                    522262
                ],
                "name": "Asmoranomardicadaistinaculdacar",
                "released_at": "2014-06-06",
                "mana_cost": "",
                "type_line": "Legendary Creature — Human Wizard",
                "oracle_text": "As long as you've discarded a card this turn, you may pay {B/R} to cast this spell.",
                "set_id": "83491685-880d-41dd-a4af-47d2b3b17c10",
                "set": "ust",
                "set_name": "Unhinged",
                "set_type": "funny",
                "collector_number": "186",
                "rarity": "rare",
                "prices": {
                    "usd": "0.22",
                    "usd_foil": "1.07",
                    "usd_etched": "",
                    "eur": "0.39",
                    "eur_foil": "0.65",
                    "tix": "0.13"
                },
            }  
        ]
        
    }

orig = botocore.client.BaseClient._make_api_call

def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "PostToConnection":
        return None
    return orig(self, operation_name, kwarg)

@requests_mock.Mocker(kw="mock")
@patch.dict(os.environ, OS_ENV, clear=True)
def test_lamda_handler_success(websocket_event, **kwargs):
    # Arrange
    kwargs["mock"].get(
        f"{SCRYFALL_URL}/cards/search",
        json=searched_cards()
    )
    
    with patch("botocore.client.BaseClient._make_api_call", new=mock_make_api_call):
        # Act
        from functions.search_card_by_keyword import app
        response = app.lambda_handler(websocket_event, {})

        # Assert
        assert response["statusCode"] == 200
