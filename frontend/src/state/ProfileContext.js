import React, { createContext, useContext, useReducer } from 'react';
import { authApi } from '../api/authApi';

const ProfileContext = createContext();

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
};

const profileReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_PROFILE_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_PROFILE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        profile: action.payload,
        error: null,
      };
    case 'FETCH_PROFILE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'UPDATE_PROFILE_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        profile: action.payload,
        error: null,
      };
    case 'UPDATE_PROFILE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  const fetchProfile = async () => {
    try {
      dispatch({ type: 'FETCH_PROFILE_START' });
      const profile = await authApi.getProfile();
      dispatch({ type: 'FETCH_PROFILE_SUCCESS', payload: profile });
      return { success: true, data: profile };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch profile';
      dispatch({ type: 'FETCH_PROFILE_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: 'UPDATE_PROFILE_START' });
      const updatedProfile = await authApi.updateProfile(profileData);
      dispatch({ type: 'UPDATE_PROFILE_SUCCESS', payload: updatedProfile });
      return { success: true, data: updatedProfile };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      dispatch({ type: 'UPDATE_PROFILE_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    ...state,
    fetchProfile,
    updateProfile,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
