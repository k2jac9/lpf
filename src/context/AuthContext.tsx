import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app, this would come from your authentication service
const mockUser: User = {
  id: 'usr_1',
  name: 'Jane Doe',
  email: 'jane.doe@legalfirm.com',
  role: 'attorney',
  organization: 'Doe & Associates',
  licenseNumber: 'BAR12345',
  isVerified: true,
  dateJoined: new Date('2023-01-15'),
  walletAddress: '0x12345...abcde',
  avatarUrl: 'https://images.pexels.com/photos/5704849/pexels-photo-5704849.jpeg?auto=compress&cs=tinysrgb&w=150'
};

// Keys for localStorage
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';
const AUTH_EXPIRY_KEY = 'auth_expiry';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if we have a stored auth token
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userDataStr = localStorage.getItem(USER_DATA_KEY);
        const expiryStr = localStorage.getItem(AUTH_EXPIRY_KEY);
        
        if (!token || !userDataStr || !expiryStr) {
          // No stored auth data
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        // Check if token has expired
        const expiry = new Date(expiryStr);
        const now = new Date();
        
        if (now > expiry) {
          // Token has expired, clear storage
          clearAuthData();
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        // Parse and validate user data
        const userData = JSON.parse(userDataStr);
        
        // Simulate API call to verify token validity
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // If we get here, auth is valid
        setUser({
          ...userData,
          dateJoined: new Date(userData.dateJoined)
        });
        
        console.log('Authentication restored from storage');
      } catch (err) {
        console.error('Error checking auth state:', err);
        clearAuthData();
        setUser(null);
        setError('Failed to restore authentication');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
  };

  const setAuthData = (user: User, token: string, expiryHours: number = 24) => {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + expiryHours);
    
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_EXPIRY_KEY, expiry.toISOString());
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call with validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, validate against mock credentials
      if (email === 'jane.doe@legalfirm.com' && password === 'password') {
        // Generate a mock JWT token
        const token = `jwt_${Date.now()}_${Math.random().toString(36)}`;
        
        setUser(mockUser);
        setAuthData(mockUser, token);
        
        console.log('Login successful');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      clearAuthData();
      setUser(null);
      setError(null);
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate required fields
      if (!userData.email || !userData.name || !password) {
        throw new Error('Missing required fields');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // For demo purposes, create new user
      const newUser: User = {
        ...mockUser,
        ...userData,
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        isVerified: false,
        dateJoined: new Date(),
      };
      
      // Generate a mock JWT token
      const token = `jwt_${Date.now()}_${Math.random().toString(36)}`;
      
      setUser(newUser);
      setAuthData(newUser, token);
      
      console.log('Registration successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = {
        ...user,
        ...userData,
      };
      
      setUser(updatedUser);
      
      // Update stored user data
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        setAuthData(updatedUser, token);
      }
      
      console.log('Profile updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      console.error('Profile update error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        register,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};