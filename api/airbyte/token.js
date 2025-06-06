import { setCorsHeaders, parseCookies } from '../_lib/auth.js';
import { findUser } from '../_lib/db.js';
import { generateWidgetToken } from '../_lib/airbyte.js';
import { getCachedUser, cacheUser } from '../_lib/userCache.js';

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

    console.log('[/api/airbyte/token] Cookies:', cookies);
    console.log('[/api/airbyte/token] User email from cookie:', userEmail);
    console.log('[/api/airbyte/token] Request origin:', req.headers.origin);
    console.log('[/api/airbyte/token] Allowed origin env var:', process.env.SONAR_ALLOWED_ORIGIN);

    if (!userEmail) {
        console.log('[/api/airbyte/token] No user email in cookies');
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Check cache first, then database
        let user = getCachedUser(userEmail) || findUser(userEmail);
        console.log('[/api/airbyte/token] User lookup result:', user);
        
        if (!user) {
            console.log('[/api/airbyte/token] User not found, creating user for email:', userEmail);
            try {
                const { addUser } = await import('../_lib/db.js');
                user = addUser(userEmail);
                // Cache the new user
                cacheUser(userEmail, user);
                console.log('[/api/airbyte/token] Created and cached new user:', user);
            } catch (addError) {
                console.error('[/api/airbyte/token] Failed to create user:', addError);
                return res.status(500).json({ error: 'Failed to create user session' });
            }
        } else if (!getCachedUser(userEmail)) {
            // Cache the user if found in database but not in cache
            cacheUser(userEmail, user);
        }

        const widgetToken = await generateWidgetToken(user.email, req.headers.origin);
        res.status(200).json({ token: widgetToken });
    } catch (error) {
        console.error('Error generating widget token:', error);
        res.status(500).json({ error: 'Failed to generate widget token' });
    }
}
