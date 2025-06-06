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
    <div className="password-protection">
      <h2 className="text-center mb-4">Access Required</h2>
      <p className="text-center text-muted mb-4">
        Please enter the password to access this application
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter password"
            required
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div className="alert alert-error mb-3">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isLoading || !password.trim()}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              Verifying...
            </>
          ) : (
            'Access Application'
          )}
        </button>
      </form>
    </div>
  );
}
