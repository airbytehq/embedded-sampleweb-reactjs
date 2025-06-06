import { setCorsHeaders, setAuthCookie } from '../_lib/auth.js';

/**
 * Password verification endpoint
 * POST /api/auth/password
 */
export default function handler(req, res) {
    // Handle CORS
    if (setCorsHeaders(res, req)) {
        return; // OPTIONS request handled
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    // Get the required password from environment variable
    const requiredPassword = process.env.SONAR_WEBAPP_PASSWORD;

    if (!requiredPassword) {
        console.error('SONAR_WEBAPP_PASSWORD environment variable not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Verify password
    if (password === requiredPassword) {
        // Set a password authentication cookie
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieValue = `webappAuth=authenticated; Max-Age=${24 * 60 * 60}; Path=/; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Strict`;
        
        res.setHeader('Set-Cookie', cookieValue);
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
}
