import { useState } from 'react';
import { usePassword } from '../contexts/PasswordContext';

export function PasswordProtection({ onPasswordCorrect }) {
  const { handlePasswordCorrect } = usePassword();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        handlePasswordCorrect();
        if (onPasswordCorrect) {
          onPasswordCorrect();
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid password');
      }
    } catch (error) {
      console.error('Password verification error:', error);
      setError('Failed to verify password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="password-protection-content">
        {/* Header Section with Logo */}
        <div className="password-header">
          <div className="logo-container">
            <img 
              src="/octavia-sonar.png" 
              alt="Octavia Sonar" 
              className="octavia-logo"
            />
          </div>
          <h1 className="app-title">Sonar Demo</h1>
          <p className="app-subtitle">Airbyte Embedded Integration</p>
        </div>

        {/* Access Required Section */}
        <div className="access-section">
          <div className="access-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="access-title">Secure Access Required</h2>
          <p className="access-description">
            This application is password protected. Please enter the access code to continue.
          </p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="password-form">
          <div className="input-group">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
              </svg>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              placeholder="Enter access code"
              required
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          {error && (
            <div className="error-message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className={`access-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? (
              <>
                <div className="button-spinner"></div>
                <span>Verifying Access...</span>
              </>
            ) : (
              <>
                <span>Access Application</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="password-footer">
          <p className="footer-text">
            Powered by <strong>Airbyte Embedded</strong>
          </p>
        </div>
      </div>

      <style jsx>{`
        .password-protection-content {
          margin: 2rem auto;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          padding: 4rem;
          width: 50%;
          min-width: 600px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }


        .password-header {
          margin-bottom: 2.5rem;
        }

        .logo-container {
          margin-bottom: 1.5rem;
        }

        .octavia-logo {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .octavia-logo:hover {
          transform: scale(1.05);
        }

        .app-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0.5rem 0 0.25rem 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .app-subtitle {
          font-size: 1rem;
          color: #718096;
          margin: 0;
          font-weight: 500;
        }

        .access-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f7fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .access-icon {
          color: #667eea;
          margin-bottom: 1rem;
        }

        .access-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.75rem 0;
        }

        .access-description {
          color: #4a5568;
          margin: 0;
          line-height: 1.6;
        }

        .password-form {
          margin-bottom: 2rem;
        }

        .input-group {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          z-index: 2;
        }

        .password-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          box-sizing: border-box;
        }

        .password-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .password-input:disabled {
          background: #f7fafc;
          cursor: not-allowed;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #e53e3e;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: #fed7d7;
          border-radius: 8px;
          border: 1px solid #feb2b2;
        }

        .access-button {
          width: 100%;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .access-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }

        .access-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .access-button.loading {
          pointer-events: none;
        }

        .button-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .password-footer {
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .footer-text {
          color: #718096;
          font-size: 0.875rem;
          margin: 0;
        }

        @media (max-width: 1200px) {
          .password-protection-content {
            width: 70%;
            min-width: 500px;
          }
        }

        @media (max-width: 768px) {
          .password-protection-content {
            width: 90%;
            min-width: 320px;
            padding: 2rem;
            margin: 1rem auto;
          }

          .octavia-logo {
            width: 64px;
            height: 64px;
          }

          .app-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </>
  );
}
