const { setCorsHeaders, setAuthCookie } = require('../_lib/auth');
const { findUser, addUser } = require('../_lib/db');

/**
 * Create/login user endpoint
 * POST /api/users
 */
module.exports = async function handler(req, res) {
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
        // Check if user already exists
        const existingUser = findUser(email);
        if (existingUser) {
            setAuthCookie(res, email);
            console.log(`[/api/users] Status: 200 - Existing user logged in: ${email}`);
            return res.status(200).json(existingUser);
        }

        const newUser = addUser(email);
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
