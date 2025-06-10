# Deployment Guide

## Vercel Deployment

This application is configured to work seamlessly on both local development and Vercel production environments.

### Environment Variables

When deploying to Vercel, you need to set the following environment variables in your Vercel dashboard:

#### Required Variables:
```
SONAR_ALLOWED_ORIGIN=https://your-app-name.vercel.app
SONAR_AIRBYTE_ORGANIZATION_ID=your-organization-id
SONAR_AIRBYTE_CLIENT_ID=your-client-id
SONAR_AIRBYTE_CLIENT_SECRET=your-client-secret
SONAR_WEBAPP_PASSWORD=your-secure-password
```

#### AWS S3 Variables (if using S3 destinations):
```
SONAR_AWS_ACCESS_KEY=your-aws-access-key
SONAR_AWS_SECRET_ACCESS_KEY=your-aws-secret-key
SONAR_S3_BUCKET=your-s3-bucket-name
SONAR_S3_BUCKET_REGION=your-s3-region
SONAR_S3_BUCKET_PREFIX=your-prefix
```

### Important Notes:

1. **SONAR_ALLOWED_ORIGIN**: Update this to your actual Vercel domain (e.g., `https://your-app.vercel.app`)
2. **API Routes**: The `/api` directory contains serverless functions that Vercel will automatically deploy
3. **Local Development**: The Express server in `/server` is only used for local development
4. **Security**: Never commit sensitive credentials to your repository

### Deployment Steps:

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add all required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your application
4. **Update SONAR_ALLOWED_ORIGIN**: After deployment, update this variable with your actual Vercel URL

### Local Development:

For local development, you need to run both servers:

```bash
# Terminal 1: Frontend (Vite)
npm run dev

# Terminal 2: Backend (Express)
cd server && npm start
```

The Vite proxy configuration will forward API requests to the local Express server during development.

### Architecture:

- **Development**: Frontend (Vite) + Backend (Express) with proxy
- **Production**: Frontend (Vite build) + API Routes (Vercel serverless functions)

This dual setup ensures optimal development experience while maintaining production compatibility.
