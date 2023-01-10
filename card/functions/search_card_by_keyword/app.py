import json
import logging
import os
import time
import requests
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()


def lambda_handler(event, context):
    """Search for a card based on the given keyword."""
    logger.info(event)
    body = json.loads(event["body"])
    query = body["query"]

    logger.info(f"Searching scryfall with query: {query}")
    payload = {"q": query, "unique": "prints"}

    # Add small delay before sending requests as mentioned in API docs
    time.sleep(0.1)
    cards_response = requests.get(
        f"{os.environ['SCRYFALL_URL']}/cards/search",
        params=payload
    )
    api_body = cards_response.json()

    mapped_cards = map(card_entry, api_body["data"])
    logger.info(f"Found {api_body['total_cards']} total cards")
    logger.info(f"Returning {len(api_body['data'])} cards")

    return {
        "event_type": "SEARCH_CARD_RESULT",
        "body": json.dumps(list(mapped_cards))
    }


def card_entry(card):
    """Map the API object to the DynamoDB entity."""
    is_multifaced = "card_faces" in card
    card_faces = []
    multiverse = card["multiverse_ids"]
    multiverse_len = len(multiverse)

    if is_multifaced:
        for idx, face in enumerate(card["card_faces"]):
            multiverse_id = multiverse[idx] if idx <= (multiverse_len - 1) else None

            card_face = create_card_face(face, multiverse_id)
            card_faces.append(card_face)
    else:
        multiverse_id = multiverse[0] if multiverse_len >= 1 else None
        card_faces.append(create_card_face(card, multiverse_id))

    return {
        "scryfall_id": card["id"],
        "collector_number": card["collector_number"],
        "rarity": card["rarity"],
        "prices": card["prices"],
        "cardmarket_id": card["cardmarket_id"] if "cardmarket_id" in card else None,
        "is_multifaced": is_multifaced,
        "oracle_id": card["oracle_id"],
        "set_id": card["set_id"],
        "set_code": card["set"],
        "set_type": card["set_type"],
        "released_at": card["released_at"],
        "card_name": card["name"],
        "card_faces": card_faces
    }


def create_card_face(card, multiverse_id):
    """Map the card face object."""
    colors = []
    image = ""

    if "image_uris" in card:
        image = card["image_uris"]["png"]

    return {
        "multiverse_id": multiverse_id,
        "card_name": card["name"],
        "oracle_text": card["oracle_text"],
        "mana_cost": card["mana_cost"],
        "colors": card["colors"] if "colors" in card else colors,
        "type_line": card["type_line"],
        "image_url": image
    }
