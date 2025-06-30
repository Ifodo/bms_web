'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  email: string;
  username: string;
  apiKey: string;
  chargingStation: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for user data and token on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      setState({
        user,
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
      const response = await fetch('https://api.bms.autotrack.ng/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data: LoginResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Save user data and token to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem('user');
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