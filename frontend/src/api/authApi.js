import apiClient from './apiClient';

export const authApi = {
  // Register a new user
  register: async (email, password) => {
    const response = await apiClient.post('/auth/register/', {
      email,
      password,
      password_confirm: password,
    });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login/', {
      email,
      password,
    });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/profile/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/profile/update/', profileData);
    return response.data;
  },
};
