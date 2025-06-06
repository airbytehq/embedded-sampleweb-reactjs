# Sonar (Airbyte Embedded) Demo App

Based off [the react sample app](https://github.com/airbytehq/embedded-sampleweb-reactjs), this instance is deployed to Vercel and assumes you have already followed the instructions in the sample app to set up the S3 connector.


## Access the app
You can access the app via https://sonar-demoapp.vercel.app/


## Configuring the app
Use the (Vercel environment keys)[https://vercel.com/airbyte-dev-rel/sonar-demoapp/settings/environment-variables] to configure the following:

SONAR_ALLOWED_ORIGIN=https://sonar-demoapp.vercel.app/

## These 3 pieces of information are available in your initial workspace: Settings > Embedded
SONAR_AIRBYTE_ORGANIZATION_ID=your_organization_id
SONAR_AIRBYTE_CLIENT_ID=your_client_id
SONAR_AIRBYTE_CLIENT_SECRET=your_client_secret

# AWS Credentials
SONAR_AWS_ACCESS_KEY=your_aws_access_key
SONAR_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# S3 Configuration
SONAR_S3_BUCKET=your_s3_bucket_name
SONAR_S3_BUCKET_REGION=your_s3_bucket_region
SONAR_S3_BUCKET_PREFIX=your_s3_bucket_prefix



