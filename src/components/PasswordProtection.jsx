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
    <div className="text-center">
      <div className="mb-4">
        <img 
          src="/octavia-sonar.png" 
          alt="Octavia Sonar" 
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--border-radius)',
            margin: '0 auto',
            display: 'block'
          }}
        />
      </div>
      
      <h1 className="text-center mb-4">Airbyte Embedded Demo</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Enter password"
            required
            disabled={isLoading}
            autoFocus
          />
        </div>
        
        {error && (
          <div className="form-group">
            <div className="text-sm" style={{ color: 'var(--accent-danger)' }}>
              {error}
            </div>
          </div>
        )}
        
        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                Verifying...
              </>
            ) : (
              'Enter'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
