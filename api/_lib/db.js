import fs from 'fs';
import path from 'path';

// For serverless functions, we'll use /tmp directory which persists during function execution
// Note: Data will be lost between cold starts, but this allows us to test the conversion
// Later we can upgrade to Vercel KV for persistent storage
const DB_FILE = path.join('/tmp', 'users.db');

/**
 * Load users from the database file
 * @returns {Array} Array of user objects
 */
function loadUsers() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
    return [];
}

/**
 * Save users to the database file
 * @param {Array} users - Array of user objects
 */
function saveUsers(users) {
    try {
        // Ensure /tmp directory exists
        const tmpDir = path.dirname(DB_FILE);
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }
        
        fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error saving users:', error);
        throw error;
    }
}

/**
 * Find a user by email
 * @param {string} email - User's email address
 * @returns {Object|null} User object or null if not found
 */
function findUser(email) {
    const users = loadUsers();
    console.log('[DB] findUser - All users:', users);
    console.log('[DB] findUser - Looking for email:', email);
    const user = users.find(user => user.email === email) || null;
    console.log('[DB] findUser - Found user:', user);
    return user;
}

/**
 * Add a new user
 * @param {string} email - User's email address
 * @returns {Object} The created user object
 */
function addUser(email) {
    const users = loadUsers();
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        throw new Error('Email already exists');
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        email: email,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return newUser;
}

/**
 * Get all users
 * @returns {Array} Array of all users
 */
function getAllUsers() {
    return loadUsers();
}

/**
 * Delete a user by email
 * @param {string} email - User's email address
 * @returns {boolean} True if user was deleted, false if not found
 */
function deleteUser(email) {
    const users = loadUsers();
    const initialLength = users.length;
    const filteredUsers = users.filter(user => user.email !== email);
    
    if (filteredUsers.length < initialLength) {
        saveUsers(filteredUsers);
        return true;
    }
    
    return false;
}

export {
    findUser,
    addUser,
    getAllUsers,
    deleteUser
};
