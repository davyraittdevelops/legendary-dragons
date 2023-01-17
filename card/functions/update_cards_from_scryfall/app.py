import json
import logging
import os
import boto3
import requests
from datetime import datetime
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()

events_client = boto3.client("events")
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ["TABLE_NAME"])

def lambda_handler(event, context):
    """Get the most recent card update from Scryfall and update our database."""
 
    logger.info("Retrieve all bulk data items")
    bulk_data_items = requests.get(os.environ["SCRYFALL_BULK_DATA_URL"]).json()

    logger.info("Downloading the bulk_data_items")
    bulk_data = requests.get(bulk_data_items['data'][2]['download_uri']).json()

    logger.info("Mapping the bulk data to our dynamodb objects")
    mapped_cards = map(card_entry, bulk_data)
    mapped_card_faces = map(card_face_entry, bulk_data)

    logger.info("Converting the maps to lists")
    card_faces_list = list(mapped_card_faces)
    card_list = list(mapped_cards)

    write_to_database(card_list, card_faces_list)
    
    return {"statusCode": 200}

def write_to_database(card_list, card_faces_list):
    """Import the update objects in the database"""
    logger.info("Import the update objects in the database")
    counter = 0
    overwrite_keys = ['PK', 'SK']
    with table.batch_writer(overwrite_by_pkeys=overwrite_keys) as writer:
        for card in card_list:
            counter = counter + 1
            writer.put_item(Item=card)
        for card_faces in card_faces_list:
            for card_face in card_faces:
                counter = counter + 1
                writer.put_item(Item=card_face)
    logger.info('Done inserting / updating ' , counter , ' entries')


def card_entry(card):
    """Map the API object to the DynamoDB entity."""
    is_multifaced = "card_faces" in card

    oracle_id = ''
    if 'oracle_id' in card:
        oracle_id = card['oracle_id']
    else:
        oracle_id = card['card_faces'][0]['oracle_id']

    return {
        "PK": "CARD#" + card["id"],
        "SK": "CARD_FACE#" + oracle_id,
        "entity_type": "CARD",
        "GSI1_PK": "CARD_FACE#" + oracle_id,
        "GSI1_SK": "CARD#" + card["id"],
        "scryfall_id": card["id"],
        "collector_number": card["collector_number"],
        "rarity": card["rarity"],
        "prices": card["prices"],
        "cardmarket_id": card["cardmarket_id"] if "cardmarket_id" in card else None,
        "is_multifaced": is_multifaced,
        "oracle_id": oracle_id,
        "created_at":  datetime.utcnow().isoformat(),
        "last_modified":  datetime.utcnow().isoformat(),
        "set_id": card["set_id"],
        "set_name": card["set_name"],
        "set_code": card["set"],
        "set_type": card["set_type"],
        "released_at": card["released_at"],
        "card_name": card["name"],
    }


def card_face_entry(card):
    is_multifaced = "card_faces" in card
    card_faces = []
    multiverse = card["multiverse_ids"]
    multiverse_len = len(multiverse)

    oracle_id = ''
    if 'oracle_id' in card:
        oracle_id = card['oracle_id']
    
    scryfall_id = ''
    if 'id' in card:  
        scryfall_id = card["id"]

    type_line = ''
    if 'type_line' in card:
        type_line = card["type_line"]

    if is_multifaced:
        for idx, face in enumerate(card["card_faces"]):
            if 'type_line' in face:
                type_line = face["type_line"]
            if oracle_id == '':
                oracle_id = face['oracle_id']
            multiverse_id = multiverse[idx] if idx <= (multiverse_len - 1) else None
            card_face = create_card_face(face, multiverse_id, oracle_id, scryfall_id, type_line )
            card_faces.append(card_face)

    else:
        multiverse_id = multiverse[0] if multiverse_len >= 1 else None
        card_faces.append(create_card_face(card, multiverse_id, oracle_id,scryfall_id, type_line))
    
    return card_faces


def create_card_face(card, multiverse_id, oracle_id, scryfall_id, type_line):
    """Map the card face object."""
    colors = []
    image = ""

    if "image_uris" in card:
        image = card["image_uris"]["png"]

    return {
        "PK": "CARD_FACE#" + oracle_id,
        "SK": "CARD#" + scryfall_id,
        "entity_type": "CARD_FACE",
        "scryfall_id": scryfall_id,
        "oracle_id": oracle_id,
        "multiverse_id": multiverse_id,        
        "card_name": card["name"],
        "oracle_text": card["oracle_text"],
        "mana_cost": card["mana_cost"],
        "colors": card["colors"] if "colors" in card else colors,
        "type_line": type_line, 
        "image_url": image,
        "GSI1_PK": "CARD#" + scryfall_id,
        "GSI1_SK": "CARD_FACE#" + oracle_id,
        "created_at":  datetime.utcnow().isoformat(),
        "last_modified":  datetime.utcnow().isoformat(),
    }
