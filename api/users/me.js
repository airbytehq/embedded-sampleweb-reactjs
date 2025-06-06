import { setCorsHeaders, parseCookies } from '../_lib/auth.js';
import { findUser } from '../_lib/db.js';
import { getCachedUser, cacheUser } from '../_lib/userCache.js';

/**
 * Get current user endpoint
 * GET /api/users/me
 */
export default function handler(req, res) {
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
        // Check cache first, then database
        let user = getCachedUser(userEmail) || findUser(userEmail);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Cache the user if found in database but not in cache
        if (!getCachedUser(userEmail)) {
            cacheUser(userEmail, user);
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ error: 'Failed to get user information' });
    }
}
