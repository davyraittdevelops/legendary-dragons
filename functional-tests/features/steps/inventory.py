# from behave import given, when, then
# import requests
# import logging
# import uuid
# import json
# import boto3
# import websocket

# logger = logging.getLogger()
# logger.setLevel(logging.INFO)

# client = boto3.client("cognito-idp", region_name="us-east-1")

# @given("we have no cards in the inventory")
# def step_impl(context):
#     context.card = {
#         "scryfallId": "7d839f21-68c7-47db-8407-ff3e2c3e13b4",
#         "collector_number": "31",
#         "rarity": "uncommon",
#         "prices": {
#             "usd": "1.03",
#             "eur": "1.33"
#         },
#         "cardmarketId": "688531",
#         "isMultifaced": "false",
#         "oracleId": "44b8eb8f-fa23-401a-98b5-1fbb9871128e",
#         "setCode": "mid",
#         "setType": "expansion",
#         "releasedAt": "2021-09-24",
#         "cardName": "Swords To Plowshares",
#     }

# @when("we add the card with the received data to the inventory")
# def step_impl(context):
#     context.ws = websocket.WebSocket()
#     context.ws.connect(url=context.websocket_url)

#     context.ws.send(json.dumps({
#         'action': 'addCardToInventoryReq',
#         'data': context.card
#     }))  


# @then("the inventory should contain a new card")
# def step_impl(context):
#     return context
