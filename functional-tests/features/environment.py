import boto3
import websocket

client = boto3.client("cognito-idp", region_name="us-east-1")

def before_all(context):
    context.base_url = "https://8l2xog7xkc.execute-api.us-east-1.amazonaws.com/Prod"
    context.detail = {}
    context.nickname = ""

    context.ws = websocket.WebSocket()
    context.websocket_url = "wss://3ghgk1q3mf.execute-api.us-east-1.amazonaws.com/Prod"

def after_feature(context, feature):
    context.ws.close()
