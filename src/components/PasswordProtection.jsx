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
        <h1 className="title">Sonar Demo</h1>
        
        <form onSubmit={handleSubmit} className="form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="password-input"
            placeholder="Enter password"
            required
            disabled={isLoading}
            autoFocus
          />
          
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
            {isLoading ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .password-protection-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .password-protection-card {
          width: 320px;
          height: 320px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          box-sizing: border-box;
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0 0 40px 0;
          text-align: center;
        }

        .form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .password-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 16px;
          background: white;
          box-sizing: border-box;
          transition: border-color 0.2s ease;
        }

        .password-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .password-input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }

        .password-input::placeholder {
          color: #999;
        }

        .error-message {
          color: #dc3545;
          font-size: 14px;
          text-align: center;
          margin: -10px 0 0 0;
        }

        .submit-button {
          width: 100%;
          padding: 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .submit-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .password-protection-card {
            width: 280px;
            height: 280px;
            padding: 30px;
          }

          .title {
            font-size: 20px;
            margin-bottom: 30px;
          }
        }
      `}</style>
    </div>
  );
}
