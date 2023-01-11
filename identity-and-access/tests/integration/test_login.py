import json
import os
import boto3
import pytest
from unittest.mock import patch
from moto import mock_cognitoidp


@pytest.fixture()
def event():
    return {'body': json.dumps({
        "email": "legendary-dragons@example.test.nl",
        "password": "Pytest2022!"
    })}


OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_SESSION_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY": "True"
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
def test_lambda_handler(event):
    # Arrange
    body = json.loads(event["body"])
    email = body["email"]
    password = body["password"]
    nickname = "Legendary Dragons"

    cognito = cognito_pool()
    client_id = cognito["app_client"]["UserPoolClient"]["ClientId"]
    os.environ["COGNITO_CLIENT"] = client_id

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

    # Act
    from functions.login.app import lambda_handler
    response = lambda_handler(event, {})

    headers = response['headers']

    # Assert
    assert response["statusCode"] == 200
    assert "Authorization" in headers


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler_user_not_confirmed(event):
    # Arrange
    body = json.loads(event["body"])
    email = body["email"]
    password = body["password"]
    nickname = "Legendary Dragons"

    cognito = cognito_pool()
    client_id = cognito["app_client"]["UserPoolClient"]["ClientId"]
    os.environ["COGNITO_CLIENT"] = client_id

    cognito["client"].sign_up(
        ClientId=client_id,
        Username=email,
        Password=password,
        UserAttributes=[
            {"Name": "email", "Value": email},
            {"Name": "nickname", "Value": nickname}
        ]
    )

    # Act
    from functions.login.app import lambda_handler
    response = lambda_handler(event, {})
    response_body = json.loads(response["body"])

    # Assert
    assert response["statusCode"] == 403
    assert "User is not confirmed" in response_body["message"]


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler_not_authorized(event):
    # Arrange
    body = json.loads(event["body"])
    email = body["email"]
    password = body["password"] + "foo"
    nickname = "Legendary Dragons"

    cognito = cognito_pool()
    client_id = cognito["app_client"]["UserPoolClient"]["ClientId"]
    os.environ["COGNITO_CLIENT"] = client_id

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

    # Act
    from functions.login.app import lambda_handler
    response = lambda_handler(event, {})
    response_body = json.loads(response["body"])

    # Assert
    assert response["statusCode"] == 403
    assert "Incorrect username or password" in response_body["message"]


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler_user_not_found(event):
    # Arrange
    body = json.loads(event["body"])
    email = body["email"]
    password = body["password"] + "foo"
    nickname = "Legendary Dragons"

    cognito = cognito_pool()
    client_id = cognito["app_client"]["UserPoolClient"]["ClientId"]
    os.environ["COGNITO_CLIENT"] = client_id

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
    body["email"] = "foo"
    event["body"] = json.dumps(body)

    # Act
    from functions.login.app import lambda_handler
    response = lambda_handler(event, {})

    # Assert
    assert response["statusCode"] == 404


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler_empty_email(event):
    # Arrange
    body = json.loads(event["body"])
    email = body["email"]
    password = body["password"] + "foo"
    nickname = "Legendary Dragons"

    cognito = cognito_pool()
    client_id = cognito["app_client"]["UserPoolClient"]["ClientId"]
    os.environ["COGNITO_CLIENT"] = client_id

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
    body["email"] = " "
    event["body"] = json.dumps(body)

    # Act
    from functions.login.app import lambda_handler
    response = lambda_handler(event, {})
    response_body = json.loads(response["body"])

    # Assert
    assert response["statusCode"] == 400
    assert "Email cannot be empty" in response_body["message"]
