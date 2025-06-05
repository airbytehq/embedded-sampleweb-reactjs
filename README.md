# Airbyte Embedded React Demo

A modern React implementation of the Airbyte Embedded sample application with a clean, light theme and modern UI/UX.


## Prerequisites

### Airbyte Credentials

To use Airbyte Embedded, you must have an active Airbyte Cloud or OSS instance with Embedded enabled. Please [contact sales](https://share.hsforms.com/2uRdBz9VoTWiCtjECzRYgawcvair) if you would like to sign up for Airbyte Embedded.

Once you have your Airbyte instance available, log in and note down the following values:

- **Organization ID**: Unique identifier to your Airbyte instance (Settings > Embedded)
- **Client ID**: Unique API ID (Settings > Applications > Create Application)
- **Client Secret**: Secret key for authentication (Settings > Applications)
- **External User ID**: A unique identifier for each user (for testing, you may set it to 0)

## Setup Instructions



### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd react-webc-embedded

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the server directory based on `.env.example`:

```bash
cd server
cp .env.example .env
cd ..
```

Edit the `server/.env` file and set your Airbyte credentials:

```env
# Airbyte Embedded Configuration
ALLOWED_ORIGIN=http://localhost:5173
AIRBYTE_ORGANIZATION_ID=your_organization_id
AIRBYTE_CLIENT_ID=your_client_id
AIRBYTE_CLIENT_SECRET=your_client_secret
```

Setup an Amazon S3 bucket for storing data, then add the following values into the `server/.env` file:


Once added, run `./setup-s3.sh` to configure the S3 destination. *NOTE: only run this script once.* Doing so multiple times will create multiple destinations in your Embedded instance.


### 3. Start Both Servers

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`
The backend API will be running at `http://localhost:3001`

## Usage

1. **Login/Register**: Enter your email address to login or create a new account
2. **Connect Data**: Once logged in, click "Connect Data" to open the Airbyte Embedded widget
3. **Manage Connections**: Use the widget to create and manage your data connections

## Project Structure

```
src/
├── components/          # React components
│   ├── LoginForm.jsx   # Email login/registration form
│   ├── UserProfile.jsx # User dashboard with connect button
│   └── Toast.jsx       # Toast notification components
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication state management
├── hooks/              # Custom React hooks
│   └── useToast.js     # Toast notification hook
├── services/           # API services
│   └── airbyteService.js # Airbyte API integration
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles and theme
```

## Key Differences from Original

This React implementation improves upon the original Node.js sample app with:

- **Modern Framework**: React with hooks and functional components
- **Better State Management**: Context API for global state
- **Improved UX**: Loading states, error handling, and toast notifications
- **Light Theme**: Clean, modern design with light colors
- **Responsive Design**: Works well on all device sizes
- **Type Safety**: Better error handling and validation
- **Modular Architecture**: Well-organized component structure

## Development Notes

### Demo Implementation Notes

This demo includes mock implementations for:
- User authentication (uses localStorage)
- User management (local JSON storage)

**Important**: The Airbyte Embedded widget requires real credentials and cannot work with mock tokens. To test the actual widget functionality:

1. **Configure Real Credentials**: Add your actual Airbyte credentials to the `.env` file
2. **Backend Required**: You'll need to implement a backend API to securely generate widget tokens
3. **Security**: Never expose your Airbyte client secret in frontend code

### Production Implementation

To make this work with real Airbyte credentials, you need to:

1. **Create a Backend API** that handles token generation:
   ```javascript
   // Backend endpoint: POST /api/airbyte/token
   app.post('/api/airbyte/token', async (req, res) => {
     const { externalUserId } = req.body;
     
     // Generate access token
     const accessToken = await getAirbyteAccessToken();
     
     // Generate widget token
     const widgetToken = await generateAirbyteWidgetToken(
       accessToken, 
       externalUserId, 
       organizationId, 
       allowedOrigin
     );
     
     res.json({ token: widgetToken });
   });
   ```

2. **Update the Frontend** to call your backend instead of generating tokens directly:
   ```javascript
   // In airbyteService.js
   const response = await fetch('/api/airbyte/token', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ externalUserId }),
   });
   const { token } = await response.json();
   return token;
   ```

3. **Security Considerations**:
   - Keep Airbyte credentials on the backend only
   - Implement proper user authentication
   - Use HTTPS in production
   - Validate user permissions before generating tokens

## Troubleshooting

### Widget Not Loading
- Check that your `server/.env` file has the correct Airbyte credentials
- Ensure the `ALLOWED_ORIGIN` matches your development URL
- Check browser console for any JavaScript errors

### Authentication Issues
- Clear your browser's localStorage if you encounter login issues
- Ensure you're using a valid email format

### Build Issues
- Make sure all dependencies are installed: `npm install`
- Try clearing the cache: `rm -rf node_modules package-lock.json && npm install`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is provided as a sample implementation for educational purposes.
