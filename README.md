# Sonar (Airbyte Embedded) Demo App

A full-stack React application with Vercel serverless functions backend, demonstrating Airbyte Embedded integration. Based on [the react sample app](https://github.com/airbytehq/embedded-sampleweb-reactjs), this instance is optimized for Vercel deployment with serverless architecture.

## 🌐 Live Demo
You can access the app via https://sonar-demoapp.vercel.app/

## 🏗️ Architecture

### Frontend
- **React 19** with **Vite** build tool
- **Airbyte Embedded Widget** integration
- Cookie-based authentication
- Responsive design with modern CSS

### Backend (Serverless Functions)
The application uses **Vercel Serverless Functions** instead of a traditional Express server for better performance and scalability:

```
api/
├── health.js          # GET /api/health - Health check
├── logout.js          # POST /api/logout - User logout
├── users/
│   ├── index.js       # POST /api/users - Create/login user
│   └── me.js          # GET /api/users/me - Get current user
├── airbyte/
│   └── token.js       # POST /api/airbyte/token - Generate widget token
└── _lib/              # Shared utilities
    ├── auth.js        # Authentication & CORS helpers
    ├── db.js          # Database operations
    └── airbyte.js     # Airbyte API integration
```

### Key Features
- **Serverless Architecture**: Each API endpoint is an independent function
- **Auto-scaling**: Functions scale automatically based on demand
- **Cookie-based Authentication**: Secure HTTP-only cookies
- **CORS Support**: Configured for cross-origin requests
- **File-based Database**: Simple JSON storage (upgradeable to Vercel KV)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Airbyte workspace with Embedded enabled
- AWS S3 bucket (for data destination)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sonar-demoapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # Frontend origin
   SONAR_ALLOWED_ORIGIN=http://localhost:5173
   
   # Airbyte Embedded credentials (from Settings > Embedded)
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
   ```

4. **Run the development server**
   ```bash
   # Start the frontend (React + Vite)
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

### Running with Vercel CLI (Recommended for testing serverless functions)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Run locally with serverless functions**
   ```bash
   vercel dev
   ```
   
   This runs both the frontend and serverless functions locally, simulating the production environment.

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

#### Required for Airbyte Integration
```bash
SONAR_AIRBYTE_ORGANIZATION_ID=your_organization_id
SONAR_AIRBYTE_CLIENT_ID=your_client_id
SONAR_AIRBYTE_CLIENT_SECRET=your_client_secret
```

#### Required for S3 Destination
```bash
SONAR_AWS_ACCESS_KEY=your_aws_access_key
SONAR_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
SONAR_S3_BUCKET=your_s3_bucket_name
SONAR_S3_BUCKET_REGION=your_s3_bucket_region
SONAR_S3_BUCKET_PREFIX=your_s3_bucket_prefix
```

#### Application Configuration
```bash
SONAR_ALLOWED_ORIGIN=https://sonar-demoapp.vercel.app  # Production
# or
SONAR_ALLOWED_ORIGIN=http://localhost:5173             # Development
```

### Vercel Deployment

For production deployment, configure these environment variables in your [Vercel dashboard](https://vercel.com/airbyte-dev-rel/sonar-demoapp/settings/environment-variables).

## 📡 API Endpoints

### Authentication
- `POST /api/users` - Create new user or login existing user
- `GET /api/users/me` - Get current authenticated user
- `POST /api/logout` - Logout user (clear auth cookie)

### Airbyte Integration
- `POST /api/airbyte/token` - Generate widget token for authenticated user

### System
- `GET /api/health` - Health check endpoint

### Authentication Flow
1. User submits email via login form
2. Backend creates user record (if new) or finds existing user
3. Sets HTTP-only authentication cookie
4. Frontend can now access protected endpoints
5. Widget token generated on-demand for Airbyte integration

## 🗄️ Database

Currently uses a simple file-based JSON database stored in `/tmp` directory during serverless function execution. 

**Note**: Data persists only during function warm state. For production use, consider upgrading to:
- **Vercel KV** (Redis-based, recommended)
- **Vercel Postgres** (for relational data)
- **External database** (MongoDB, PostgreSQL, etc.)

### Database Schema
```javascript
{
  "id": "timestamp_string",
  "email": "user@example.com", 
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Security Features

- **HTTP-only Cookies**: Prevents XSS attacks
- **CORS Configuration**: Restricts cross-origin requests
- **Environment Variables**: Sensitive data not in code
- **Input Validation**: Email validation and sanitization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Troubleshooting Deployment
If you encounter runtime errors during deployment:
- Ensure all serverless functions use `module.exports` (not `export default`)
- Remove any `vercel.json` file - Vercel auto-detects Node.js functions
- Check that environment variables are properly configured in Vercel dashboard
- Verify all API functions are in the `/api` directory with `.js` extension

## 🛠️ Development

### Project Structure
```
├── api/                    # Serverless functions
│   ├── _lib/              # Shared utilities
│   ├── users/             # User management endpoints
│   └── airbyte/           # Airbyte integration endpoints
├── src/                   # React frontend source
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── services/          # API service layer
├── public/                # Static assets
├── server/                # Legacy Express server (deprecated)
└── package.json           # Dependencies and scripts
```

### Adding New API Endpoints
1. Create new file in `api/` directory
2. Export default async function handler
3. Use shared utilities from `api/_lib/`
4. Follow existing patterns for CORS and error handling

Example:
```javascript
const { setCorsHeaders } = require('./_lib/auth');

module.exports = async function handler(req, res) {
    if (setCorsHeaders(res, req)) return;
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    res.json({ message: 'Hello World' });
}
```
