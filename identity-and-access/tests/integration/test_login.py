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

@patch.dict(os.environ, OS_ENV, clear=True)
@mock_cognitoidp
def test_lambda_handler(event):
    # Arrange
    body = json.loads(event["body"])
    email = body["email"]
    password = body["password"]
    nickname = "Legendary Dragons"

    cognito_client = boto3.client("cognito-idp")
    user_pool_id = cognito_client.create_user_pool(PoolName="TestUserPool")["UserPool"][
        "Id"
    ]

    app_client = cognito_client.create_user_pool_client(
    UserPoolId=user_pool_id, ClientName="TestLegendaryDragonsClient")
    os.environ["COGNITO_CLIENT"] = app_client["UserPoolClient"]["ClientId"]

    cognito_client.sign_up(
    ClientId=app_client["UserPoolClient"]["ClientId"],
    Username=email,
    Password=password,
    UserAttributes=[
        {"Name": "email", "Value": email},
        {"Name": "nickname", "Value": nickname}
    ]
    )

    cognito_client.admin_confirm_sign_up(UserPoolId=user_pool_id, Username=email)

    # Act
    from functions.login.app import lambda_handler
    response = lambda_handler(event, {})

    headers = response['headers']

    # Assert
    assert response["statusCode"] == 200
    assert "Authorization" in headers
