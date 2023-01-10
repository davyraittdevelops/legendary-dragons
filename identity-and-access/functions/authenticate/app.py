import json

def lambda_handler(event, context):
    # Extract the token from the request
    token = event["headers"].get("Authorization")

    # Authentication and Authorization Logic
    if not token:
        return {
            "statusCode": 401,
            "body": "Unauthorized"
        }
    if token != "valid_token":
        return {
            "statusCode": 403,
            "body": "Forbidden"
        }

    # Prepare the policy statement
    policy = {
        "principalId": "user",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "execute-api:Invoke",
                    "Resource": event["methodArn"]
                }
            ]
        }
    }

    # Return the policy
    return {
        "statusCode": 200,
        "body": json.dumps(policy)
    }