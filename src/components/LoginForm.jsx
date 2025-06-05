import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    const result = await login(email.trim());
    
    if (result.success && onSuccess) {
      onSuccess(result.isNewUser);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email" className="label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="input"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
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
          disabled={isLoading || !email.trim()}
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              Processing...
            </>
          ) : (
            'Login or Create Account'
          )}
        </button>
      </div>
    </form>
  );
}
