import json
import logging
import os
import time
import requests
import boto3
from aws_xray_sdk.core import patch_all

CHUNK_LIMIT = 50

logger = logging.getLogger()
logger.setLevel(logging.INFO)

if "DISABLE_XRAY" not in os.environ:
    patch_all()


def lambda_handler(event, context):
    """Get card details by querying the cached cards database"""
    print('test')
   