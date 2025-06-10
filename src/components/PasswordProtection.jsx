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
      <div className="background-overlay"></div>
      
      <div className="content-wrapper">
        <div className="left-section">
          <div className="brand-section">
            <div className="logo-wrapper">
              <img 
                src="/octavia-sonar.png" 
                alt="Octavia Sonar" 
                className="logo"
              />
            </div>
            <h1 className="brand-title">SONAR</h1>
            <h2 className="brand-subtitle">EXPLORE<br />DATA HORIZONS</h2>
            <p className="brand-description">
              Discover insights beyond the surface with powerful data analytics
            </p>
          </div>
        </div>

        <div className="right-section">
          <div className="login-card">
            <h3 className="login-title">Welcome Back</h3>
            <p className="login-subtitle">Enter your access code to continue</p>
            
            <form onSubmit={handleSubmit} className="form">
              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="password-input"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? 'Verifying...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .password-protection-container {
          min-height: 100vh;
          display: flex;
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          overflow: hidden;
        }

        .background-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="400" cy="700" r="120" fill="url(%23a)"/></svg>') no-repeat center center;
          background-size: cover;
          opacity: 0.3;
        }

        .content-wrapper {
          display: flex;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .left-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: white;
        }

        .brand-section {
          max-width: 500px;
        }

        .logo-wrapper {
          margin-bottom: 24px;
        }

        .logo {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .brand-title {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 16px 0;
          letter-spacing: 4px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .brand-subtitle {
          font-size: 48px;
          font-weight: 800;
          margin: 0 0 24px 0;
          line-height: 1.1;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .brand-description {
          font-size: 18px;
          opacity: 0.9;
          line-height: 1.6;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .right-section {
          width: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .login-card {
          width: 100%;
          max-width: 320px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 40px 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .login-title {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin: 0 0 8px 0;
          text-align: center;
        }

        .login-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0 0 32px 0;
          text-align: center;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        .password-input {
          width: 100%;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          box-sizing: border-box;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .password-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }

        .password-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .error-message {
          color: #ff6b6b;
          font-size: 14px;
          text-align: center;
          background: rgba(255, 107, 107, 0.1);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 107, 107, 0.3);
          margin: -8px 0 0 0;
        }

        .submit-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .content-wrapper {
            flex-direction: column;
          }

          .left-section {
            padding: 40px 20px 20px 20px;
            text-align: center;
          }

          .brand-subtitle {
            font-size: 36px;
          }

          .right-section {
            width: 100%;
            padding: 20px;
          }

          .login-card {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .left-section {
            padding: 20px;
          }

          .brand-title {
            font-size: 24px;
          }

          .brand-subtitle {
            font-size: 28px;
          }

          .brand-description {
            font-size: 16px;
          }

          .login-card {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}
