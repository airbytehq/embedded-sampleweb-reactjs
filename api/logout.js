import { setCorsHeaders, clearAuthCookie } from './_lib/auth.js';

/**
 * User logout endpoint
 * POST /api/logout
 */
export default function handler(req, res) {
    // Handle CORS
    if (setCorsHeaders(res, req)) {
        return; // OPTIONS request handled
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Clear the authentication cookie
    clearAuthCookie(res);
    
    res.status(200).json({ message: 'Logged out successfully' });
}
