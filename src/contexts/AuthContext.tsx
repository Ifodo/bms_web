'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  username: string;
  apiKey: string;
  chargingStation: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    _id: string;
    email: string;
    username: string;
    apiKey: string;
    chargingStation: string;
    // Add any other fields from the response
  };
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginResponse: LoginResponse | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loginResponse: null,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for user data, login response, and token on mount
    const storedUser = localStorage.getItem('user');
    const storedLoginResponse = localStorage.getItem('loginResponse');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedLoginResponse && storedToken) {
      const user = JSON.parse(storedUser);
      const loginResponse = JSON.parse(storedLoginResponse);
      setState({
        user,
        loginResponse,
        token: storedToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState({ ...initialState, isLoading: false });
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data: LoginResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Save user data to localStorage
      const userData: User = {
        id: data.user._id,
        email: data.user.email,
        username: data.user.username,
        apiKey: data.user.apiKey,
        chargingStation: data.user.chargingStation,
      };
      
      // Save user data, login response, and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('loginResponse', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      setState({
        user: userData,
        loginResponse: data,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });

      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('loginResponse');
      localStorage.removeItem('token');
      
      // Clear auth state
      setState({ ...initialState, isLoading: false });
      
      // Redirect to login
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getToken = () => {
    return state.token || localStorage.getItem('token');
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    getToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 