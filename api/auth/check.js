import { setCorsHeaders, parseCookies } from '../_lib/auth.js';

/**
 * Check password authentication status
 * GET /api/auth/check
 */
export default function handler(req, res) {
    // Handle CORS
    if (setCorsHeaders(res, req)) {
        return; // OPTIONS request handled
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse cookies to check for webapp authentication
    const cookies = parseCookies(req.headers.cookie);
    const webappAuth = cookies.webappAuth;

    // Check if password protection is enabled
    const requiredPassword = process.env.SONAR_WEBAPP_PASSWORD;
    
    if (!requiredPassword) {
        // No password protection configured
        return res.status(200).json({ 
            authenticated: true, 
            passwordRequired: false 
        });
    }

    // Password protection is enabled, check if user is authenticated
    const isAuthenticated = webappAuth === 'authenticated';
    
    res.status(200).json({ 
        authenticated: isAuthenticated, 
        passwordRequired: true 
    });
}
