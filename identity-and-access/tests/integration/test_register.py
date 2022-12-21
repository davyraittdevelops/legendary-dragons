import os
from unittest.mock import patch

OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_SESSION_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY": "True"
}


@patch.dict(os.environ, OS_ENV, clear=True)
def test_lambda_handler():
    # Arrange
    # Act
    from functions.register.app import lambda_handler

    response = lambda_handler({}, {})

    # Assert
    assert response["statusCode"] == 201
