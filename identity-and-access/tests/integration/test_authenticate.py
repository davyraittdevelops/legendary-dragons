import json
import os
import boto3
import pytest
import requests_mock
from unittest.mock import patch
from moto import mock_cognitoidp

OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_SESSION_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "AWS_REGION": "us-west02",
    "DISABLE_XRAY": "True"
}


@pytest.fixture()
def event():
    return {
        "queryStringParameters": {
            "token": ""
        },
        "methodArn": "arn:aws:lambda:us-east-1:1243456:function:tmp"
    }


@pytest.fixture()
def invalid_jwk():
    return {
        "keys": [
            {
                "alg": "RS256",
                "e": "AQAB",
                "kid": "rAH",
                "kty": "RSA",
                "n": "yfOfrwBu5Z_1dGuZOqANxhFme4T19i2uuVJfmCs4LHtftcD0-G-Ugf",
                "use": "sig"
            },
            {
                "alg": "RS256",
                "e": "AQAB",
                "kid": "yUryPkmrGNpg0No",
                "kty": "RSA",
                "n": "TcPVJ2BJZv3oFsnmOazDSF4K4TKsjE03uHJTZA1ZEaYSHaF8xdJ_",
                "use": "sig"
            }
        ]
    }


def cognito_pool():
    cognito_client = boto3.client("cognito-idp")
    user_pool_id = cognito_client.create_user_pool(
        PoolName="TestUserPool"
    )["UserPool"]["Id"]
    app_client = cognito_client.create_user_pool_client(
        UserPoolId=user_pool_id, ClientName="TestLegendaryDragonsClient"
    )

    return {
        "app_client": app_client,
        "client": cognito_client,
        "user_pool_id": user_pool_id
    }


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler(event, **kwargs):
    # Arrange
    email = "legendary-dragons@example.test.nl"
    password = "Pytest2022!"
    nickname = "Legendary Dragons"

    cognito = cognito_pool()
    client_id = cognito["app_client"]["UserPoolClient"]["ClientId"]
    os.environ["APP_CLIENT_ID"] = client_id
    os.environ["USERPOOL_ID"] = "someuserpoolid"

    cognito["client"].sign_up(
        ClientId=client_id,
        Username=email,
        Password=password,
        UserAttributes=[
            {"Name": "email", "Value": email},
            {"Name": "nickname", "Value": nickname}
        ]
    )
    cognito["client"].admin_confirm_sign_up(
        UserPoolId=cognito["user_pool_id"], Username=email
    )

    login_response = cognito["client"].initiate_auth(
        ClientId=client_id, AuthFlow="USER_PASSWORD_AUTH",
        AuthParameters={
            "USERNAME": email, "PASSWORD": password
        }
    )
    token = login_response["AuthenticationResult"]["IdToken"]
    event["queryStringParameters"]["token"] = token

    # Act
    from functions.authenticate.app import lambda_handler
    response = lambda_handler(event, {})
    statement = response["policyDocument"]["Statement"][0]

    # Assert
    assert statement["Effect"] == "Allow"
    assert statement["Action"] == "execute-api:Invoke"
    assert statement["Resource"] == event["methodArn"]


@requests_mock.Mocker(kw="mock")
@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler_invalid_public_key(event, invalid_jwk, **kwargs):
    # Arrange
    email = "legendary-dragons@example.test.nl"
    password = "Pytest2022!"
    nickname = "Legendary Dragons"

    cognito = cognito_pool()
    client_id = cognito["app_client"]["UserPoolClient"]["ClientId"]
    os.environ["APP_CLIENT_ID"] = client_id
    os.environ["USERPOOL_ID"] = cognito["user_pool_id"]

    cognito["client"].sign_up(
        ClientId=client_id,
        Username=email,
        Password=password,
        UserAttributes=[
            {"Name": "email", "Value": email},
            {"Name": "nickname", "Value": nickname}
        ]
    )
    cognito["client"].admin_confirm_sign_up(
        UserPoolId=cognito["user_pool_id"], Username=email
    )

    login_response = cognito["client"].initiate_auth(
        ClientId=client_id, AuthFlow="USER_PASSWORD_AUTH",
        AuthParameters={
            "USERNAME": email, "PASSWORD": password
        }
    )

    kwargs["mock"].get(
        "https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json".format(
            os.environ["AWS_REGION"], os.environ["USERPOOL_ID"]
        ),
        json=invalid_jwk
    )

    token = login_response["AuthenticationResult"]["IdToken"]
    event["queryStringParameters"]["token"] = token

    # Act
    from functions.authenticate.app import lambda_handler
    response = lambda_handler(event, {})
    statement = response["policyDocument"]["Statement"][0]

    # Assert
    assert statement["Effect"] == "Deny"
    assert statement["Action"] == "*"
    assert statement["Resource"] == "*"
