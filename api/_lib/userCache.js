/**
 * Simple in-memory user cache for serverless functions
 * This is a temporary solution for demo purposes
 * In production, use Vercel KV or a proper database
 */

// Global user cache (persists during function warm state)
let userCache = new Map();

/**
 * Add user to cache
 * @param {string} email - User email
 * @param {Object} user - User object
 */
export function cacheUser(email, user) {
    userCache.set(email, user);
    console.log('[UserCache] Cached user:', email, user);
}

/**
 * Get user from cache
 * @param {string} email - User email
 * @returns {Object|null} User object or null
 */
export function getCachedUser(email) {
    const user = userCache.get(email) || null;
    console.log('[UserCache] Retrieved user:', email, user);
    return user;
}

/**
 * Check if user exists in cache
 * @param {string} email - User email
 * @returns {boolean} True if user exists
 */
export function hasUser(email) {
    return userCache.has(email);
}

/**
 * Clear all cached users
 */
export function clearCache() {
    userCache.clear();
    console.log('[UserCache] Cache cleared');
}

/**
 * Get all cached users (for debugging)
 * @returns {Array} Array of all cached users
 */
export function getAllCachedUsers() {
    return Array.from(userCache.values());
}
