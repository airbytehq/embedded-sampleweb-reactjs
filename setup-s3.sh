#!/bin/bash

# Enable debug mode to show commands as they execute
set -x

echo "=== Starting Airbyte Setup ==="
echo "* ONLY RUN THIS SCRIPT ONCE *"
echo "* If you need to run it again after successfully executing previously, please contact support as your existing environment may need to be modified *"

# Load .env file from server directory
echo "Loading environment variables from server/.env"
source server/.env

# Check if required variables are set
echo "Checking required environment variables..."
REQUIRED_VARS=("SONAR_AIRBYTE_CLIENT_ID" "SONAR_AIRBYTE_CLIENT_SECRET" "SONAR_AIRBYTE_ORGANIZATION_ID" 
               "SONAR_AWS_ACCESS_KEY" "SONAR_AWS_SECRET_ACCESS_KEY" "SONAR_S3_BUCKET" 
               "SONAR_S3_BUCKET_REGION" "SONAR_S3_BUCKET_PREFIX")

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "ERROR: Required variable $var is not set in server/.env file"
    exit 1
  else
    echo "✓ $var is set"
  fi
done

echo "All required variables are set"

# Get Access Token from Airbyte API
echo "Requesting access token from Airbyte API..."
TOKEN_RESPONSE=$(curl -sX POST \
  'https://api.airbyte.com/v1/applications/token' \
  -H 'Content-Type: application/json' \
  -d "{
    \"client_id\": \"${SONAR_AIRBYTE_CLIENT_ID}\",
    \"client_secret\": \"${SONAR_AIRBYTE_CLIENT_SECRET}\",
    \"grant-type\": \"client_credentials\"
  }")

# Check if token request was successful
if [[ $TOKEN_RESPONSE == *"access_token"* ]]; then
  ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')
  echo "✓ Successfully obtained access token"
else
  echo "ERROR: Failed to get access token. Response:"
  echo "$TOKEN_RESPONSE" | jq '.'
  exit 1
fi

# Create connection template that will replicate data to S3
echo "Creating connection template for S3..."
CONN_RESPONSE=$(curl -X POST 'https://api.airbyte.com/v1/config_templates/connections' \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -d "{
      \"destinationName\": \"S3-embedded\", 
      \"organizationId\": \"${SONAR_AIRBYTE_ORGANIZATION_ID}\",
      \"destinationActorDefinitionId\": \"4816b78f-1489-44c1-9060-4b19d5fa9362\",
      \"destinationConfiguration\": {
        \"access_key_id\": \"${SONAR_AWS_ACCESS_KEY}\",
        \"secret_access_key\": \"${SONAR_AWS_SECRET_ACCESS_KEY}\",
        \"s3_bucket_name\": \"${SONAR_S3_BUCKET}\",
        \"s3_bucket_path\": \"${SONAR_S3_BUCKET_PREFIX}\",
        \"s3_bucket_region\": \"${SONAR_S3_BUCKET_REGION}\",
        \"format\": {
            \"format_type\": \"CSV\",
            \"compression\": {
                \"compression_type\": \"No Compression\"
            },
        \"flattening\": \"No flattening\"
      }
    }
  }
}")

# Print the full response for debugging
echo "Connection template response:"
echo "$CONN_RESPONSE" | jq '.'

# Check if connection creation was successful
if [[ $CONN_RESPONSE == *"id"* ]]; then
  CONFIG_TEMPLATE_ID=$(echo $CONN_RESPONSE | jq -r '.id')
  echo "✓ Successfully created connection template with ID: $CONFIG_TEMPLATE_ID"
  echo "✓ Setup completed successfully!"
else
  echo "ERROR: Failed to create connection template. Response:"
  echo "$CONN_RESPONSE" | jq '.'
  exit 1
fi

echo "=== Setup Complete ==="

# Disable debug mode
set +x
