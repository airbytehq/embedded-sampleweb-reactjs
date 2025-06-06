import { useAuth } from './contexts/AuthContext';
import { usePassword } from './contexts/PasswordContext';
import { useToast } from './hooks/useToast';
import { LoginForm } from './components/LoginForm';
import { UserProfile } from './components/UserProfile';
import { PasswordProtection } from './components/PasswordProtection';
import { ToastContainer } from './components/Toast';

function App() {
  const { isAuthenticated } = useAuth();
  const { isPasswordAuthenticated, passwordRequired, isLoading } = usePassword();
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast();

  const handleLoginSuccess = (isNewUser) => {
    if (isNewUser) {
      showSuccess('Account created and logged in successfully!');
    } else {
      showSuccess('Login successful!');
    }
  };

  const handleConnectSuccess = () => {
    showInfo('Airbyte widget opened successfully!');
  };

  const handleConnectError = (error) => {
    showError(error || 'Failed to connect data. Please try again.');
  };

  const handlePasswordSuccess = () => {
    showSuccess('Access granted successfully!');
  };

  // Show loading state while checking password authentication
  if (isLoading) {
    return (
      <div className="container">
        <div className="card">
          <div className="text-center">
            <div className="spinner" />
            <p className="text-muted mt-2">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show password protection if required and user is not authenticated
  if (passwordRequired && !isPasswordAuthenticated) {
    return (
      <div className="container">
        <div className="card">
          <PasswordProtection onPasswordCorrect={handlePasswordSuccess} />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="text-center mb-4">
          Airbyte Embedded Demo
        </h1>
        
        <p className="text-center text-muted mb-4">
          Airbyte Embedded React sample app
        </p>

        {!isAuthenticated ? (
          <LoginForm onSuccess={handleLoginSuccess} />
        ) : (
          <UserProfile 
            onConnectSuccess={handleConnectSuccess}
            onConnectError={handleConnectError}
          />
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-muted">
            {!isAuthenticated ? (
              'Enter your email to login or create a new account'
            ) : (
              'Click "Connect Data" to open the Airbyte Embedded widget'
            )}
          </p>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
