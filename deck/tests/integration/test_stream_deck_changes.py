import os
import json
import pytest
import boto3
from moto import mock_events, mock_sqs
from unittest.mock import patch

OS_ENV = {
    "AWS_ACCESS_KEY_ID": "testing",
    "AWS_SECRET_ACCESS_KEY": "testing",
    "AWS_SECURITY_TOKEN": "testing",
    "AWS_DEFAULT_REGION": "us-east-1",
    "DISABLE_XRAY":  "True",
    "EVENT_BUS_NAME": "test-event-bus"
 }


@pytest.fixture()
def stream_event():
    return {
        "Records": [
            {
                "eventSourceARN": "arn:aws:us-1:123:dynamodb/TestTable/stream",
                "source": "deck.database",
                "eventName": "INSERT",
                "eventID": "12345",
                "dynamodb": {
                    "ApproximateCreationDateTime": 1625309472.357246,
                }
            },
            {
                "eventSourceARN": "arn:aws:us-1:123:dynamodb/TestTable/stream",
                "source": "deck.database",
                "eventName": "MODIFY",
                "eventID": "123459",
                "dynamodb": {
                    "ApproximateCreationDateTime": 1625309472.357246,
                }
            }
        ]
    }


@patch.dict(os.environ, OS_ENV, clear=True)
@mock_events
@mock_sqs
def test_lambda_handler(stream_event):
    # Arrange
    sqs = boto3.resource("sqs")
    queue = sqs.create_queue(QueueName="test-output-queue")
    client = boto3.client("events")
    client.create_event_bus(Name=OS_ENV["EVENT_BUS_NAME"])
    client.put_rule(
        Name="test-rule", EventBusName=OS_ENV["EVENT_BUS_NAME"],
        EventPattern=json.dumps(
            {"detail-type": ["INSERT"], "source": ["deck.database"]}
        )
    )
    client.put_targets(
        Rule="test-rule", EventBusName=OS_ENV["EVENT_BUS_NAME"],
        Targets=[{
            "Id": "testing-target",
            "Arn": queue.attributes.get("QueueArn")
        }]
    )

    # Act
    from functions.stream_deck_changes import app
    response = app.lambda_handler(stream_event, {})
    messages = queue.receive_messages(MaxNumberOfMessages=2)
    stream_message = json.loads(messages[0].body)

    # Assert
    assert response["statusCode"] == 200
    assert len(messages) == 1
    assert stream_message["detail-type"] == "INSERT"
