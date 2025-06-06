/**
 * Authentication utilities for Vercel serverless functions
 */

/**
 * Parse cookies from request headers
 * @param {string} cookieHeader - The cookie header string
 * @returns {Object} Parsed cookies object
 */
export function parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return cookies;
    
    cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
            cookies[name] = decodeURIComponent(value);
        }
    });
    
    return cookies;
}

/**
 * Set authentication cookie in response
 * @param {Object} res - Response object
 * @param {string} email - User email
 */
export function setAuthCookie(res, email) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieValue = `userEmail=${encodeURIComponent(email)}; Max-Age=${7 * 24 * 60 * 60}; Path=/; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Strict`;
    
    res.setHeader('Set-Cookie', cookieValue);
}

/**
 * Clear authentication cookie
 * @param {Object} res - Response object
 */
export function clearAuthCookie(res) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieValue = `userEmail=; Max-Age=0; Path=/; HttpOnly; ${isProduction ? 'Secure; ' : ''}SameSite=Strict`;
    
    res.setHeader('Set-Cookie', cookieValue);
}

/**
 * Set CORS headers for the response
 * @param {Object} res - Response object
 * @param {Object} req - Request object
 */
export function setCorsHeaders(res, req) {
    // Get the origin from the request
    const requestOrigin = req.headers.origin;
    
    // Define allowed origins
    const allowedOrigins = [
        'https://sonar-demoapp.vercel.app',
        'https://sonar-demoapp.vercel.app/',
        'http://localhost:5173',
        'http://localhost:3000',
        process.env.SONAR_ALLOWED_ORIGIN
    ].filter(Boolean); // Remove any undefined values
    
    // Check if the request origin is allowed
    const allowedOrigin = allowedOrigins.includes(requestOrigin) 
        ? requestOrigin 
        : (process.env.SONAR_ALLOWED_ORIGIN || 'http://localhost:5173');
    
    console.log('[CORS] Request origin:', requestOrigin);
    console.log('[CORS] Allowed origins:', allowedOrigins);
    console.log('[CORS] Using origin:', allowedOrigin);
    
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true;
    }
    
    return false;
}
