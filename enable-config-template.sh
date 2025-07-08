#!/bin/bash

# The following script demonstrates how to use the API to create a new configuration template
# for the Faker connector, with a required “*count*” field. 
# To obtain the `source_connector_definition_id`, 
# you can access this via the [Airbyte Connector Registry](https://connectors.airbyte.com/files/generated_reports/connector_registry_report.html).

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

# Create connection source for faker
echo "Creating connection source..."
CONN_RESPONSE=$(curl --request POST \
  --url https://api.airbyte.ai/api/v1/embedded/config_templates/sources/ \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer ${ACCESS_TOKEN}" \
  --data "{
    \"organization_id\": \"${SONAR_AIRBYTE_ORGANIZATION_ID}\",
    \"partial_default_config\": {},
    \"partialUserConfigSpec\": {
      \"connectionSpecification\": {
        \"\$schema\": \"http://json-schema.org/draft-07/schema#\",
        \"title\": \"Faker Source Spec2\",
        \"type\": \"object\",
        \"required\": [\"count\"],
        \"properties\": {
          \"count\": {
            \"title\": \"Count\",
            \"description\": \"How many users should be generated in total. The purchases table will be scaled to match, with 10 purchases created per 10 users. This setting does not apply to the products stream.\",
            \"type\": \"integer\",
            \"minimum\": 1,
            \"default\": 5005,
            \"order\": 0
          }
        }
      }
    },
    \"actor_definition_id\": \"dfd88b22-b603-4c3d-aad7-3701784586b1\"
  }")

# Print the full response for debugging
echo "Raw Connection template response:"
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
