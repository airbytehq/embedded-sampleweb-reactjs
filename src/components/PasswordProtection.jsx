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
    <div className="password-protection-container">
      <div className="password-protection-card">
        {/* Header */}
        <div className="header-section">
          <div className="logo-wrapper">
            <img 
              src="/octavia-sonar.png" 
              alt="Octavia Sonar" 
              className="logo"
            />
          </div>
          <h1 className="title">Sonar Demo</h1>

        </div>

        {/* Security Notice */}
        <div className="security-notice">
          <div className="lock-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
            </svg>
          </div>
          <h2 className="security-title">Secure Access Required</h2>
          <p className="security-description">
            Enter your access code to continue to the application
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-section">
          <div className="input-wrapper">
            <div className="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor"/>
              </svg>
            </div>
            <input
              type="password"
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
            <div className="error-alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <button
            type="submit"
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Access Application</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/>
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="footer-section">
          <p className="footer-text">
            Powered by <strong>Airbyte Embedded</strong>
          </p>
        </div>
      </div>

      <style jsx>{`
        .password-protection-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .password-protection-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
        }

        .header-section {
          padding: 32px 32px 24px 32px;
          text-align: center;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .logo-wrapper {
          margin-bottom: 16px;
        }

        .logo {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .title {
          font-size: 24px;
          font-weight: 700;
          color: #1a202c;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 16px;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .security-notice {
          padding: 24px 32px;
          text-align: center;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }

        .lock-icon {
          color: #667eea;
          margin-bottom: 12px;
        }

        .security-title {
          font-size: 18px;
          font-weight: 600;
          color: #334155;
          margin: 0 0 8px 0;
        }

        .security-description {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          line-height: 1.4;
        }

        .form-section {
          padding: 24px 32px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .input-wrapper {
          position: relative;
          margin-bottom: 16px;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          z-index: 2;
        }

        .password-input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          background: white;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        .password-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .password-input:disabled {
          background: #f8fafc;
          cursor: not-allowed;
        }

        .password-input::placeholder {
          color: #94a3b8;
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #dc2626;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
          padding: 10px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
        }

        .submit-button {
          width: 100%;
          padding: 14px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-button.loading {
          pointer-events: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .footer-section {
          padding: 16px 32px 24px 32px;
          text-align: center;
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          flex-shrink: 0;
        }

        .footer-text {
          font-size: 13px;
          color: #64748b;
          margin: 0;
        }

        @media (max-width: 480px) {
          .password-protection-container {
            padding: 16px;
          }

          .password-protection-card {
            max-width: 100%;
            aspect-ratio: auto;
            min-height: 420px;
          }

          .header-section,
          .security-notice,
          .form-section {
            padding-left: 20px;
            padding-right: 20px;
          }

          .footer-section {
            padding: 12px 20px 20px 20px;
          }

          .title {
            font-size: 22px;
          }

          .security-title {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
