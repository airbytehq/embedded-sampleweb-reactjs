const { setCorsHeaders, parseCookies } = require('../_lib/auth');
const { findUser } = require('../_lib/db');

/**
 * Get current user endpoint
 * GET /api/users/me
 */
module.exports = function handler(req, res) {
    // Handle CORS
    if (setCorsHeaders(res, req)) {
        return; // OPTIONS request handled
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse cookies to get user email
    const cookies = parseCookies(req.headers.cookie);
    const userEmail = cookies.userEmail;

    if (!userEmail) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const user = findUser(userEmail);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ error: 'Failed to get user information' });
    }
}
