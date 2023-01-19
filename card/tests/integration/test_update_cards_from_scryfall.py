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
SCRYFALL_BULK_DATA_URL = "https://api.scryfall.com/bulk-data"
OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY":  "True",
    "EVENT_BUS_NAME": "test-event-bus",
    "SCRYFALL_BULK_DATA_URL": SCRYFALL_BULK_DATA_URL,
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

def bulk_data():
    return {
   "object":"list",
   "has_more":False,
   "data":[
      {
      },
      {
      },
      {
         "download_uri":"https://data.scryfall.io/default-cards/default-cards-20230118100523.json"
      }
   ]
}


def bulk_data_request():
    return [
        {
        "object":"card",
        "id":"0000579f-7b35-4ed3-b44c-db2a538066fe",
        "oracle_id":"44623693-51d6-49ad-8cd7-140505caf02f",
        "multiverse_ids":[
            109722
        ],
        "mtgo_id":25527,
        "mtgo_foil_id":25528,
        "tcgplayer_id":14240,
        "cardmarket_id":13850,
        "name":"Fury Sliver",
        "lang":"en",
        "released_at":"2006-10-06",
        "uri":"https://api.scryfall.com/cards/0000579f-7b35-4ed3-b44c-db2a538066fe",
        "scryfall_uri":"https://scryfall.com/card/tsp/157/fury-sliver?utm_source=api",
        "layout":"normal",
        "highres_image":True,
        "image_status":"highres_scan",
        "image_uris":{
            "small":"https://cards.scryfall.io/small/front/0/0/0000579f-7b35-4ed3-b44c-db2a538066fe.jpg?1562894979",
            "normal":"https://cards.scryfall.io/normal/front/0/0/0000579f-7b35-4ed3-b44c-db2a538066fe.jpg?1562894979",
            "large":"https://cards.scryfall.io/large/front/0/0/0000579f-7b35-4ed3-b44c-db2a538066fe.jpg?1562894979",
            "png":"https://cards.scryfall.io/png/front/0/0/0000579f-7b35-4ed3-b44c-db2a538066fe.png?1562894979",
            "art_crop":"https://cards.scryfall.io/art_crop/front/0/0/0000579f-7b35-4ed3-b44c-db2a538066fe.jpg?1562894979",
            "border_crop":"https://cards.scryfall.io/border_crop/front/0/0/0000579f-7b35-4ed3-b44c-db2a538066fe.jpg?1562894979"
        },
        "mana_cost":"{5}{R}",
        "cmc":6.0,
        "type_line":"Creature — Sliver",
        "oracle_text":"All Sliver creatures have double strike.",
        "power":"3",
        "toughness":"3",
        "colors":[
            "R"
        ],
        "color_identity":[
            "R"
        ],
        "keywords":[
            
        ],
        "legalities":{
            "standard":"not_legal",
            "future":"not_legal",
            "historic":"not_legal",
            "gladiator":"not_legal",
            "pioneer":"not_legal",
            "explorer":"not_legal",
            "modern":"legal",
            "legacy":"legal",
            "pauper":"not_legal",
            "vintage":"legal",
            "penny":"legal",
            "commander":"legal",
            "brawl":"not_legal",
            "historicbrawl":"not_legal",
            "alchemy":"not_legal",
            "paupercommander":"restricted",
            "duel":"legal",
            "oldschool":"not_legal",
            "premodern":"not_legal"
        },
        "games":[
            "paper",
            "mtgo"
        ],
        "reserved":False,
        "foil":True,
        "nonfoil":True,
        "finishes":[
            "nonfoil",
            "foil"
        ],
        "oversized":False,
        "promo":False,
        "reprint":False,
        "variation":False,
        "set_id":"c1d109bc-ffd8-428f-8d7d-3f8d7e648046",
        "set":"tsp",
        "set_name":"Time Spiral",
        "set_type":"expansion",
        "set_uri":"https://api.scryfall.com/sets/c1d109bc-ffd8-428f-8d7d-3f8d7e648046",
        "set_search_uri":"https://api.scryfall.com/cards/search?order=set\u0026q=e%3Atsp\u0026unique=prints",
        "scryfall_set_uri":"https://scryfall.com/sets/tsp?utm_source=api",
        "rulings_uri":"https://api.scryfall.com/cards/0000579f-7b35-4ed3-b44c-db2a538066fe/rulings",
        "prints_search_uri":"https://api.scryfall.com/cards/search?order=released\u0026q=oracleid%3A44623693-51d6-49ad-8cd7-140505caf02f\u0026unique=prints",
        "collector_number":"157",
        "digital":False,
        "rarity":"uncommon",
        "flavor_text":"\"A rift opened, and our arrows were abruptly stilled. To move was to push the world. But the sliver's claw still twitched, red wounds appeared in Thed's chest, and ribbons of blood hung in the air.\"\n—Adom Capashen, Benalish hero",
        "card_back_id":"0aeebaf5-8c7d-4636-9e82-8c27447861f7",
        "artist":"Paolo Parente",
        "artist_ids":[
            "d48dd097-720d-476a-8722-6a02854ae28b"
        ],
        "illustration_id":"2fcca987-364c-4738-a75b-099d8a26d614",
        "border_color":"black",
        "frame":"2003",
        "full_art":False,
        "textless":False,
        "booster":True,
        "story_spotlight":False,
        "edhrec_rank":5708,
        "penny_rank":11007,
        "prices":{
            "usd":"0.37",
            "usd_foil":"3.95",
            "usd_etched":None,
            "eur":"0.07",
            "eur_foil":"1.49",
            "tix":"0.02"
        },
        "related_uris":{
            "gatherer":"https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=109722",
            "tcgplayer_infinite_articles":"https://infinite.tcgplayer.com/search?contentMode=article\u0026game=magic\u0026partner=scryfall\u0026q=Fury+Sliver\u0026utm_campaign=affiliate\u0026utm_medium=api\u0026utm_source=scryfall",
            "tcgplayer_infinite_decks":"https://infinite.tcgplayer.com/search?contentMode=deck\u0026game=magic\u0026partner=scryfall\u0026q=Fury+Sliver\u0026utm_campaign=affiliate\u0026utm_medium=api\u0026utm_source=scryfall",
            "edhrec":"https://edhrec.com/route/?cc=Fury+Sliver"
        }
    }]
    

orig = botocore.client.BaseClient._make_api_call
def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == "PostToConnection":
        return None
    return orig(self, operation_name, kwarg)

@patch.dict(os.environ, OS_ENV, clear=True)
@requests_mock.Mocker(kw="mock")
@mock_events
@mock_dynamodb
def test_lambda_handler(stream_event, table_definition, **kwargs):
    # Arrange
    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.create_table(**table_definition)
    kwargs["mock"].get(
        SCRYFALL_BULK_DATA_URL,
        json=bulk_data()
    )

    kwargs["mock"].get(
        'https://data.scryfall.io/default-cards/default-cards-20230118100523.json',
        json=bulk_data_request()
    )

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
