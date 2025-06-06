import { createContext, useContext, useState, useEffect } from 'react';

const PasswordContext = createContext();

export function usePassword() {
  const context = useContext(PasswordContext);
  if (!context) {
    throw new Error('usePassword must be used within a PasswordProvider');
  }
  return context;
}

export function PasswordProvider({ children }) {
  const [isPasswordAuthenticated, setIsPasswordAuthenticated] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check password authentication status on mount
  useEffect(() => {
    checkPasswordAuth();
  }, []);

  const checkPasswordAuth = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsPasswordAuthenticated(data.authenticated);
        setPasswordRequired(data.passwordRequired);
      } else {
        // If check fails, assume not authenticated
        setIsPasswordAuthenticated(false);
        setPasswordRequired(true);
      }
    } catch (error) {
      console.error('Error checking password auth:', error);
      // On error, assume password is required and user is not authenticated
      setIsPasswordAuthenticated(false);
      setPasswordRequired(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordCorrect = () => {
    setIsPasswordAuthenticated(true);
  };

  const value = {
    isPasswordAuthenticated,
    passwordRequired,
    isLoading,
    handlePasswordCorrect,
    checkPasswordAuth,
  };

  return (
    <PasswordContext.Provider value={value}>
      {children}
    </PasswordContext.Provider>
  );
}
