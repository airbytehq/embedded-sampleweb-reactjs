import { setCorsHeaders, setAuthCookie } from '../_lib/auth.js';
import { findUser, addUser } from '../_lib/db.js';
import { cacheUser, getCachedUser } from '../_lib/userCache.js';

/**
 * Create/login user endpoint
 * POST /api/users
 */
export default async function handler(req, res) {
    // Handle CORS
    if (setCorsHeaders(res, req)) {
        return; // OPTIONS request handled
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;
    
    // Validate input
    if (!email) {
        console.log(`[/api/users] Status: 400 - Email is required`);
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Check cache first, then database
        let existingUser = getCachedUser(email) || findUser(email);
        if (existingUser) {
            // Cache the user if found in database but not in cache
            if (!getCachedUser(email)) {
                cacheUser(email, existingUser);
            }
            setAuthCookie(res, email);
            console.log(`[/api/users] Status: 200 - Existing user logged in: ${email}`);
            return res.status(200).json(existingUser);
        }

        const newUser = addUser(email);
        // Cache the new user
        cacheUser(email, newUser);
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
}
