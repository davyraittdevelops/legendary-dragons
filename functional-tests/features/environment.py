import boto3
import os

client = boto3.client("cognito-idp", region_name="us-east-1")


def before_all(context):
    context.base_url = "https://ml16d2y5s9.execute-api.us-east-1.amazonaws.com/Prod"
    context.detail = {}


def after_feature(context, feature):
    client.admin_delete_user(
        UserPoolId=os.environ["COGNITO_POOL_ID"],
        Username=context.detail["email"]
    )
