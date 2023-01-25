import json
import logging
import os
import time
import requests
import boto3
from aws_xray_sdk.core import patch_all

CHUNK_LIMIT = 50

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()


def lambda_handler(event, context):
    """Search for a card based on the given keyword."""
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

    mapped_cards = []

    if "data" in api_body:
        mapped_cards = map(card_entry, api_body["data"])
        logger.info(f"Found {api_body['total_cards']} total cards")
        logger.info(f"Returning {len(api_body['data'])} cards")

    connection_id = event["requestContext"]["connectionId"]
    domain_name = event["requestContext"]["domainName"]
    stage = event["requestContext"]["stage"]
    endpoint = f"https://{domain_name}/{stage}"

    logger.info(f"Requests will be made to {endpoint}")

    logger.info(f"Sending cards result to client with id: {connection_id}")
    send_data_chunks(list(mapped_cards), endpoint, connection_id)

    return {"statusCode": 200}


def send_data_chunks(cards, endpoint, connection_id):
    """Send the cards in chunks when needed to avoid large payloads."""
    apigateway = boto3.client("apigatewaymanagementapi", endpoint_url=endpoint)

    half_length = len(cards) // 2
    output = {"event_type": "SEARCH_CARD_RESULT", "data": cards}

    if half_length >= CHUNK_LIMIT:
        first_chunk, second_chunk = cards[:half_length], cards[half_length:]

        logger.info("Sending first chunk with size {len(first_chunk)}")
        output = {"event_type": "SEARCH_CARD_RESULT", "data": first_chunk}
        apigateway.post_to_connection(
            ConnectionId=connection_id,
            Data=json.dumps(output)
        )

        output = {"event_type": "SEARCH_CARD_RESULT", "data": second_chunk}

    logger.info(f"Sending last chunk with size {len(output['data'])}")
    apigateway.post_to_connection(
        ConnectionId=connection_id,
        Data=json.dumps(output)
    )


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

    oracle_id = card.get('oracle_id', '')
    if oracle_id == '':
        oracle_id = card["card_faces"][0]['oracle_id']

    return {
        "scryfall_id": card["id"],
        "collector_number": card["collector_number"],
        "rarity": card["rarity"],
        "prices": card["prices"],
        "cardmarket_id": card["cardmarket_id"] if "cardmarket_id" in card else None,
        "is_multifaced": is_multifaced,
        "oracle_id": oracle_id,
        "set_id": card["set_id"],
        "set_name": card["set_name"],
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
