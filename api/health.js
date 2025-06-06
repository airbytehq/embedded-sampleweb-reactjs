const { setCorsHeaders } = require('./_lib/auth');

/**
 * Health check endpoint
 * GET /api/health
 */
module.exports = function handler(req, res) {
    // Handle CORS
    if (setCorsHeaders(res, req)) {
        return; // OPTIONS request handled
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.status(200).json({ 
        status: 'ok', 
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
}
