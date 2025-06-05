import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateWidgetToken, openAirbyteWidget, loadAirbyteWidget, closeAirbyteWidget } from '../services/airbyteService';

export function UserProfile({ onConnectSuccess, onConnectError }) {
  const { user, logout } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  // Load the Airbyte widget script on component mount
  useEffect(() => {
    loadAirbyteWidget()
      .then(() => {
        setWidgetLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load Airbyte widget:', error);
        setWidgetLoaded(false);
      });

    // Cleanup: close widget when component unmounts
    return () => {
      closeAirbyteWidget();
    };
  }, []);

  const handleConnectData = async () => {
    if (!user) return;

    setIsConnecting(true);

    try {
      // Generate widget token
      const token = await generateWidgetToken(user.email);
      
      if (!widgetLoaded) {
        throw new Error('Airbyte widget not loaded. Please refresh the page and try again.');
      }

      // Open the widget
      openAirbyteWidget(token);
      
      if (onConnectSuccess) {
        onConnectSuccess();
      }
      
    } catch (error) {
      console.error('Error connecting data:', error);
      if (onConnectError) {
        onConnectError(error.message);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleLogout = () => {
    // Close any open widget before logging out
    closeAirbyteWidget();
    logout();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-info">
      <p className="text-sm text-muted">
        Logged in as: <strong>{user.email}</strong>
      </p>
      
      <div className="form-group">
        <button
          onClick={handleConnectData}
          className="btn btn-secondary"
          disabled={isConnecting || !widgetLoaded}
        >
          {isConnecting ? (
            <>
              <div className="spinner" />
              Connecting...
            </>
          ) : !widgetLoaded ? (
            'Loading Widget...'
          ) : (
            'Connect Data'
          )}
        </button>
      </div>

      <div className="form-group">
        <button
          onClick={handleLogout}
          className="btn btn-danger"
        >
          Logout
        </button>
      </div>

      {!widgetLoaded && (
        <p className="text-sm text-muted mt-4">
          Loading Airbyte widget... If this takes too long, please refresh the page.
        </p>
      )}
    </div>
  );
}
