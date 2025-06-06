import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer function
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Local storage helpers
const STORAGE_KEY = 'airbyte_embedded_user';

function saveUserToStorage(user) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user to localStorage:', error);
  }
}

function getUserFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to get user from localStorage:', error);
    return null;
  }
}

function removeUserFromStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove user from localStorage:', error);
  }
}

// API functions for backend communication
async function createOrLoginUser(email) {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create or login user');
    }
    
    const user = await response.json();
    
    // Check if this was a new user (simplified check)
    const isNewUser = response.status === 201;
    
    return { user, isNewUser };
  } catch (error) {
    console.error('Error creating/logging in user:', error);
    throw error;
  }
}

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: storedUser });
    }
  }, []);

  // Auth actions
  const login = async (email) => {
    if (!email || !email.includes('@')) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: 'Please enter a valid email address' });
      return { success: false };
    }

    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

    try {
      const { user, isNewUser } = await createOrLoginUser(email);
      
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
      saveUserToStorage(user);
      
      return { success: true, isNewUser };
    } catch (error) {
      const errorMessage = error.message || 'Failed to login. Please try again.';
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout to clear HTTP-only cookie
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error calling logout API:', error);
      // Continue with local logout even if API call fails
    }
    
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    removeUserFromStorage();
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
