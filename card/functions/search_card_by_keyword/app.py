import json
import logging
import os
import boto3
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

    cards_response = requests.get(
        f"{os.environ['SCRYFALL_URL']}/cards/search",
        params=payload
    )
    api_body = cards_response.json()

    mapped_cards = map(card_entry, api_body["data"])
    logger.info(f"Found {api_body['total_cards']} total cards")

    return {"statusCode": 200, "body": json.dumps(list(mapped_cards))}


def card_entry(card):
    is_multifaced = "card_faces" in card
    colors = []
    image = ""
    card_faces = []

    # Loop through card_faces instead of mutliverse
    for idx, multiverse_id in enumerate(card["multiverse_ids"]):
        card_base = card

        if is_multifaced:
            card_base = card["card_faces"][idx]

        if "image_uris" in card_base:
            image = card_base["image_uris"]["png"]

        card_face = {
            "multiverse_id": multiverse_id,
            "card_name": card_base["name"],
            "oracle_text": card_base["oracle_text"],
            "mana_cost": card_base["mana_cost"],
            "colors": card_base["colors"] if "colors" in card_base else colors,
            "type_line": card_base["type_line"],
            "image_url": image
        }

        card_faces.append(card_face)

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
