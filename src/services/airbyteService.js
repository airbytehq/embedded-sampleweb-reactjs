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
    const response = await fetch('/api/airbyte/token', {
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
    
    console.log('Opening Airbyte widget with token:', token);
    
    // Create new widget instance with minimal configuration
    // Following the official Airbyte documentation format
    currentWidget = new window.AirbyteEmbeddedWidget({
      token: token
    });
    
    console.log('Widget instance created:', currentWidget);
    
    // Add event listeners if available
    if (currentWidget.on) {
      currentWidget.on('close', () => {
        console.log('Widget close event triggered');
        currentWidget = null;
      });
      
      currentWidget.on('error', (error) => {
        console.error('Widget error event:', error);
      });
      
      currentWidget.on('load', () => {
        console.log('Widget load event triggered');
      });
    }
    
    // Open the widget
    currentWidget.open();
    console.log('Widget open() called');
    
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
      console.log('Airbyte widget already loaded');
      resolve();
      return;
    }
    
    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="airbyte-embedded-widget"]');
    if (existingScript) {
      console.log('Airbyte widget script already exists, waiting for load...');
      // Wait for it to load
      const checkLoaded = () => {
        if (window.AirbyteEmbeddedWidget) {
          console.log('Airbyte widget loaded from existing script');
          resolve();
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }
    
    console.log('Loading Airbyte Embedded Widget script...');
    
    const script = document.createElement('script');
    // Use the exact version from package.json
    script.src = 'https://cdn.jsdelivr.net/npm/@airbyte-embedded/airbyte-embedded-widget@0.4.2/dist/index.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('Airbyte Embedded Widget script loaded');
      // Give it a moment to initialize
      setTimeout(() => {
        if (window.AirbyteEmbeddedWidget) {
          console.log('AirbyteEmbeddedWidget is available');
          resolve();
        } else {
          console.error('AirbyteEmbeddedWidget not found after script load');
          reject(new Error('AirbyteEmbeddedWidget not available after script load'));
        }
      }, 100);
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Airbyte widget script:', error);
      reject(new Error('Failed to load Airbyte Embedded Widget'));
    };
    
    document.head.appendChild(script);
  });
}
