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
    # Make GET request to JSON file
 
    """Retrieve all bulk data items:"""
    response = requests.get("https://api.scryfall.com/bulk-data")
    bulk_data_items = response.json()
    print(bulk_data_items)
    print(bulk_data_items['data'])
    print(bulk_data_items['data'][2])
    print(bulk_data_items['data'][2]['download_uri'])

    """Retrieve A JSON file containing every card object on Scryfall in English or the printed language if the card is only available in one language."""
    response = requests.get(bulk_data_items['data'][2]['download_uri'])
    bulk_data= response.json()

    mapped_cards = map(card_entry, bulk_data)
    mapped_card_faces = map(card_face_entry, bulk_data)

    """Convert to set, to avoid duplicates"""
    card_faces_list = list(mapped_card_faces)
    card_list = list(mapped_cards)
    print("Lengths: " ,  len(card_faces_list) , '                   ' , len(card_list))

    """Import the update objects in the database"""
    print('Start of batch writing function')
    counter = 0
    overwrite_keys = ['PK', 'SK']
    with table.batch_writer(overwrite_by_pkeys=overwrite_keys) as writer:
        for card in card_list:
            counter = counter + 1
            # print('Writing card... ' , card)
            writer.put_item(Item=card)
        for card_faces in card_faces_list:
            for card_face in card_faces:
                counter = counter + 1
                # print('Writing card face... ' , card_face)
                writer.put_item(Item=card_face)

    print('Done inserting ' , counter , ' entries :-)')
    
    return {"statusCode": 200}


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
        # print('Card faces is multi faced looks like...' , card_faces)

    else:
        multiverse_id = multiverse[0] if multiverse_len >= 1 else None
        card_faces.append(create_card_face(card, multiverse_id, oracle_id,scryfall_id, type_line))
        # print('Card faces is single faced looks like...' , card_faces)

    
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
