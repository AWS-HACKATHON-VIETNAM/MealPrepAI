import apiClient from './apiClient';

export const groceryApi = {
  // Search for grocery items
  searchItems: async (query) => {
    const response = await apiClient.get('/grocery/search/', {
      params: { query },
    });
    return response.data;
  },

  // Get user's grocery list
  getGroceryList: async () => {
    const response = await apiClient.get('/grocery/list/');
    return response.data;
  },

  // Add item to grocery list
  addToGroceryList: async (itemData) => {
    const response = await apiClient.post('/grocery/list/', itemData);
    return response.data;
  },

  // Remove item from grocery list
  removeFromGroceryList: async (itemId) => {
    const response = await apiClient.delete(`/grocery/list/${itemId}/`);
    return response.data;
  },
};
