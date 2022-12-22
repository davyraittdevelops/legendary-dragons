import json
import os
import boto3
import pytest
from unittest.mock import patch
from moto import mock_cognitoidp

OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_SESSION_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY": "True"
}


@pytest.fixture()
def event():
    return {
        'body': json.dumps({
            "nickname": "foobar",
            "email": "legendary-dragons@example.test.nl",
            "password": "Pytest2022!"
        })
    }


def cognito_pool():
    cognito_client = boto3.client("cognito-idp")
    user_pool_id = cognito_client.create_user_pool(
        PoolName="TestUserPool",
        Policies={
            "PasswordPolicy": {
                'MinimumLength': 10,
                'RequireUppercase': True,
                'RequireLowercase': True,
                'RequireNumbers': True,
                'RequireSymbols': True,
            }
        },
        AutoVerifiedAttributes=['email'],
        UsernameAttributes=['email']
    )["UserPool"]["Id"]

    pool_client = cognito_client.create_user_pool_client(
        UserPoolId=user_pool_id, ClientName="TestLegendaryDragonsClient"
    )
    return {
        "cognito_client": cognito_client,
        "pool_client": pool_client,
        "user_pool_id": user_pool_id
    }


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler_successful(event):
    # Arrange
    os.environ["COGNITO_CLIENT"] = cognito_pool()["pool_client"]["UserPoolClient"]["ClientId"]

    # Act
    from functions.register.app import lambda_handler
    response = lambda_handler(event, {})

    # Assert
    assert response["statusCode"] == 201


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler_empty_email(event):
    # Arrange
    body = json.loads(event["body"])
    body["email"] = ""
    event["body"] = json.dumps(body)
    os.environ["COGNITO_CLIENT"] = cognito_pool()["pool_client"]["UserPoolClient"]["ClientId"]

    # Act
    from functions.register.app import lambda_handler
    response = lambda_handler(event, {})
    response_body = json.loads(response["body"])

    # Assert
    assert response["statusCode"] == 400
    assert "Email cannot be empty" in response_body["message"]


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler_invalid_password(event):
    # Arrange
    body = json.loads(event["body"])
    body["password"] = "invalidpassword"
    event["body"] = json.dumps(body)
    os.environ["COGNITO_CLIENT"] = cognito_pool()["pool_client"]["UserPoolClient"]["ClientId"]

    # Act
    from functions.register.app import lambda_handler
    response = lambda_handler(event, {})
    response_body = json.loads(response["body"])

    # Assert
    assert response["statusCode"] == 400
    assert "configured password policy" in response_body["message"]


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler_user_exists(event):
    # Arrange
    body = json.loads(event["body"])
    nickname = body["nickname"]
    email = body["email"]
    password = body["password"]
    cognito = cognito_pool()

    client_id = cognito["pool_client"]["UserPoolClient"]["ClientId"]
    os.environ["COGNITO_CLIENT"] = client_id

    cognito["cognito_client"].sign_up(
        ClientId=client_id,
        Username=email,
        Password=password,
        UserAttributes=[
            {"Name": "email", "Value": email},
            {"Name": "nickname", "Value": nickname}
        ]
    )

    cognito["cognito_client"].admin_confirm_sign_up(
        UserPoolId=cognito["user_pool_id"], Username=email
    )

    # Act
    from functions.register.app import lambda_handler
    response = lambda_handler(event, {})

    # Assert
    assert response["statusCode"] == 409


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler_invalid_parameter(event):
    # Arrange
    body = json.loads(event["body"])
    body["email"] = "test"
    event["body"] = json.dumps(body)
    os.environ["COGNITO_CLIENT"] = cognito_pool()["pool_client"]["UserPoolClient"]["ClientId"]

    # Act
    from functions.register.app import lambda_handler
    response = lambda_handler(event, {})
    response_body = json.loads(response["body"])

    # Assert
    assert response["statusCode"] == 400
    assert "Username should be" in response_body["message"]
