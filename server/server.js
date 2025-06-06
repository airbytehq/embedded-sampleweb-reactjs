require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./db');
const api = require('./airbyte_api');

const app = express();
const port = process.env.PORT || 3001;

// Helper function to set authentication cookie
function setAuthCookie(res, email) {
    res.cookie('userEmail', email, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
}

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration for React frontend
app.use(cors({
    origin: process.env.SONAR_ALLOWED_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// Fake Auth: read user from cookie
app.use((req, res, next) => {
    const userEmail = req.cookies.userEmail;
    if (userEmail) {
        try {
            const user = db.findUser(decodeURIComponent(userEmail));
            if (user) {
                req.user = user;
            }
        } catch (error) {
            console.error('Error reading user from cookie:', error);
        }
    }
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend server is running' });
});

// Endpoint to handle logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('userEmail', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully' });
});

// Endpoint to create a new user
app.post('/api/users', async (req, res) => {
    const { email } = req.body;
    
    // Validate input
    if (!email) {
        console.log(`[/api/users] Status: 400 - Email is required`);
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Check if user already exists
        const existingUser = db.findUser(email);
        if (existingUser) {
            setAuthCookie(res, email);
            console.log(`[/api/users] Status: 200 - Existing user logged in: ${email}`);
            return res.json(existingUser);
        }

        const newUser = db.addUser(email);
        setAuthCookie(res, email);
        console.log(`[/api/users] Status: 201 - New user created: ${email}`);
        res.status(201).json(newUser);
    } catch (error) {
        if (error.message === 'Email already exists') {
            console.log(`[/api/users] Status: 400 - ${error.message}`);
            return res.status(400).json({ error: error.message });
        }
        console.error('Error creating user:', error);
        console.log(`[/api/users] Status: 500 - Failed to create user: ${error.message}`);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Endpoint to get current user information
app.get('/api/users/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json(req.user);
});

// Endpoint to generate a widget token that will be passed to the widget in the web app
app.post('/api/airbyte/token', async (req, res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const widgetToken = await api.generateWidgetToken(req.user.email);
        res.json({ token: widgetToken });
    } catch (error) {
        console.error('Error generating widget token:', error);
        res.status(500).json({ error: 'Failed to generate widget token' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log('Environment variables loaded:');
    console.log('SONAR_ALLOWED_ORIGIN:', process.env.SONAR_ALLOWED_ORIGIN);
    console.log('SONAR_AIRBYTE_ORGANIZATION_ID:', process.env.SONAR_AIRBYTE_ORGANIZATION_ID);
    console.log('SONAR_AIRBYTE_CLIENT_ID:', process.env.SONAR_AIRBYTE_CLIENT_ID ? '***' : 'not set');
    console.log('SONAR_AIRBYTE_CLIENT_SECRET:', process.env.SONAR_AIRBYTE_CLIENT_SECRET ? '***' : 'not set');
    console.log('SONAR_AWS_ACCESS_KEY:', process.env.SONAR_AWS_ACCESS_KEY ? '***' : 'not set');
    console.log('SONAR_AWS_SECRET_ACCESS_KEY:', process.env.SONAR_AWS_SECRET_ACCESS_KEY ? '***' : 'not set');
    console.log('SONAR_S3_BUCKET:', process.env.SONAR_S3_BUCKET);
    console.log('SONAR_S3_BUCKET_REGION:', process.env.SONAR_S3_BUCKET_REGION);
    console.log('SONAR_S3_BUCKET_PREFIX:', process.env.SONAR_S3_BUCKET_PREFIX);
});
