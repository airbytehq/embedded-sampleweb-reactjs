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
async function generateWidgetToken(externalUserId) {
    try {
        const accessToken = await getAccessToken();

        const response = await fetch('https://api.airbyte.com/v1/embedded/widget_token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                externalUserId: externalUserId,
                organizationId: process.env.SONAR_AIRBYTE_ORGANIZATION_ID,
                allowedOrigin: process.env.SONAR_ALLOWED_ORIGIN,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to get widget token: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        return data.token;
    } catch (error) {
        console.error('Error generating widget token:', error);
        throw error;
    }
}

module.exports = {
    generateWidgetToken
};
