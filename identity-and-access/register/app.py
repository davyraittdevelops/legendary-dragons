import logging
import os
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()


def lambda_handler(event, context):
    """Register a new user with AWS Cognito."""
    return {
        "statusCode": 201,
    }
