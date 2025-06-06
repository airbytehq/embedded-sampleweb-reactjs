/**
 * Airbyte API utilities for serverless functions
 */

/**
 * Generates a new access token from the Airbyte API
 * @returns {Promise<string>} The access token
 */
async function getAccessToken() {
    try {
        const response = await fetch('https://api.airbyte.com/v1/applications/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: process.env.SONAR_AIRBYTE_CLIENT_ID,
                client_secret: process.env.SONAR_AIRBYTE_CLIENT_SECRET,
                "grant-type": "client_credentials"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to get access token: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}

/**
 * Generates a widget token for the Airbyte API
 * @param {string} externalUserId - The ID of the external user
 * @returns {Promise<string>} The widget token
 */
async function generateWidgetToken(externalUserId, requestOrigin = null) {
    try {
        const accessToken = await getAccessToken();
        
        // Determine the correct allowed origin
        let allowedOrigin = process.env.SONAR_ALLOWED_ORIGIN || 'https://sonar-demoapp.vercel.app';
        
        // If we have a request origin, use it if it matches our expected origins
        if (requestOrigin) {
            const validOrigins = [
                'https://sonar-demoapp.vercel.app',
                'https://sonar-demoapp.vercel.app/',
                'http://localhost:5173',
                'http://localhost:3000'
            ];
            
            if (validOrigins.includes(requestOrigin)) {
                allowedOrigin = requestOrigin;
                console.log('[Airbyte] Using validated request origin:', allowedOrigin);
            }
        }
        
        // Normalize origin (remove trailing slash for consistency)
        allowedOrigin = allowedOrigin.replace(/\/$/, '');
        
        const requestBody = {
            externalUserId: externalUserId,
            organizationId: process.env.SONAR_AIRBYTE_ORGANIZATION_ID,
            allowedOrigin: allowedOrigin,
        };
        
        console.log('[Airbyte] Widget token request:', requestBody);
        console.log('[Airbyte] Environment variables check:');
        console.log('  - SONAR_AIRBYTE_ORGANIZATION_ID:', process.env.SONAR_AIRBYTE_ORGANIZATION_ID ? 'SET' : 'NOT SET');
        console.log('  - SONAR_AIRBYTE_CLIENT_ID:', process.env.SONAR_AIRBYTE_CLIENT_ID ? 'SET' : 'NOT SET');
        console.log('  - SONAR_AIRBYTE_CLIENT_SECRET:', process.env.SONAR_AIRBYTE_CLIENT_SECRET ? 'SET' : 'NOT SET');
        console.log('  - SONAR_ALLOWED_ORIGIN:', process.env.SONAR_ALLOWED_ORIGIN || 'NOT SET');

        const response = await fetch('https://api.airbyte.com/v1/embedded/widget_token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[Airbyte] Widget token error response:', errorData);
            throw new Error(`Failed to get widget token: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        console.log('[Airbyte] Widget token response:', data);
        return data.token;
    } catch (error) {
        console.error('Error generating widget token:', error);
        throw error;
    }
}

export {
    generateWidgetToken
};
