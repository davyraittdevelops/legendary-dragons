import json
import logging
import os
import boto3
from datetime import datetime
from aws_xray_sdk.core import patch_all

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()


def lambda_handler(event, context):
    """Create a new Inventory entry after account confirmation."""
    logger.info(event)

    return {"statusCode": 200}
