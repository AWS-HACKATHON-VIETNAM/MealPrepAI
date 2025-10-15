import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../lib/apiClient';
import type { UserProfile, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../types/api.types';
import { API_ENDPOINTS } from '../config/api.config';

interface AuthContextType {
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          await loadProfile();
        } catch (error) {
          console.error('Failed to load profile:', error);
          apiClient.clearTokens();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await apiClient.get<UserProfile>(API_ENDPOINTS.AUTH.PROFILE);
      setProfile(profileData);
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        { requiresAuth: false }
      );

      apiClient.setTokens(response.access, response.refresh);
      
      // Load profile after successful login
      await loadProfile();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      console.log('🔵 Registration attempt:', { 
        endpoint: API_ENDPOINTS.AUTH.REGISTER, 
        data: { ...data, password: '[REDACTED]', password_confirm: '[REDACTED]' }
      });
      
      const response = await apiClient.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        data,
        { requiresAuth: false }
      );

      console.log('✅ Registration successful');
      apiClient.setTokens(response.access, response.refresh);
      
      // Load profile after successful registration
      await loadProfile();
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    apiClient.clearTokens();
    setProfile(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const updatedProfile = await apiClient.put<UserProfile>(
        API_ENDPOINTS.AUTH.UPDATE_PROFILE,
        data
      );
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    await loadProfile();
  };

  const value: AuthContextType = {
    profile,
    isAuthenticated: !!profile,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
