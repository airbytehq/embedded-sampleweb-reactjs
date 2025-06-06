import { setCorsHeaders, parseCookies } from '../_lib/auth.js';
import { findUser } from '../_lib/db.js';
import { generateWidgetToken } from '../_lib/airbyte.js';

/**
 * Generate Airbyte widget token endpoint
 * POST /api/airbyte/token
 */
export default async function handler(req, res) {
    // Handle CORS
    if (setCorsHeaders(res, req)) {
        return; // OPTIONS request handled
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Parse cookies to get user email
    const cookies = parseCookies(req.headers.cookie);
    const userEmail = cookies.userEmail;

    if (!userEmail) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Verify user exists
        const user = findUser(userEmail);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const widgetToken = await generateWidgetToken(user.email);
        res.status(200).json({ token: widgetToken });
    } catch (error) {
        console.error('Error generating widget token:', error);
        res.status(500).json({ error: 'Failed to generate widget token' });
    }
}
