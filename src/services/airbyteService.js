// Mock Airbyte API service
// In a real implementation, this would make actual API calls to your backend

/**
 * Generates a mock access token for Airbyte API
 * In production, this would be handled by your backend
 */
async function getAccessToken() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would make a POST request to your backend
  // which would then call the Airbyte API with your credentials
  const mockToken = `mock_access_token_${Date.now()}`;
  
  return mockToken;
}

/**
 * Generates a widget token for the Airbyte Embedded widget
 * @param {string} externalUserId - The user's email or unique identifier
 * @returns {Promise<string>} The widget token
 */
export async function generateWidgetToken(externalUserId) {
  try {
    // Call the backend API to generate the widget token
    const response = await fetch('http://localhost:3001/api/airbyte/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({
        externalUserId,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate widget token');
    }
    
    const data = await response.json();
    return data.token;
    
  } catch (error) {
    console.error('Error generating widget token:', error);
    throw new Error(`Failed to generate widget token: ${error.message}`);
  }
}

// Global widget instance to prevent multiple widgets
let currentWidget = null;

/**
 * Opens the Airbyte Embedded widget
 * @param {string} token - The widget token
 */
export function openAirbyteWidget(token) {
  try {
    // Check if the Airbyte widget library is loaded
    if (typeof window.AirbyteEmbeddedWidget === 'undefined') {
      throw new Error('Airbyte Embedded Widget library not loaded');
    }
    
    // Close existing widget if one is open
    if (currentWidget) {
      try {
        currentWidget.close();
      } catch (e) {
        console.warn('Failed to close existing widget:', e);
      }
      currentWidget = null;
    }
    
    // Create new widget instance
    currentWidget = new window.AirbyteEmbeddedWidget({
      token: token,
    });
    
    // Add event listeners to clean up when widget is closed
    if (currentWidget.on) {
      currentWidget.on('close', () => {
        currentWidget = null;
      });
    }
    
    currentWidget.open();
    
  } catch (error) {
    console.error('Error opening Airbyte widget:', error);
    throw new Error(`Failed to open widget: ${error.message}`);
  }
}

/**
 * Close the current widget if one is open
 */
export function closeAirbyteWidget() {
  if (currentWidget) {
    try {
      currentWidget.close();
    } catch (e) {
      console.warn('Failed to close widget:', e);
    }
    currentWidget = null;
  }
}

/**
 * Load the Airbyte Embedded Widget script dynamically
 * @returns {Promise<void>}
 */
export function loadAirbyteWidget() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.AirbyteEmbeddedWidget) {
      resolve();
      return;
    }
    
    // Check if script is already being loaded
    if (document.querySelector('script[src*="airbyte-embedded-widget"]')) {
      // Wait for it to load
      const checkLoaded = () => {
        if (window.AirbyteEmbeddedWidget) {
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@airbyte-embedded/airbyte-embedded-widget@0.4.2';
    script.async = true;
    
    script.onload = () => {
      console.log('Airbyte Embedded Widget loaded successfully');
      resolve();
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Airbyte Embedded Widget'));
    };
    
    document.head.appendChild(script);
  });
}
