import apiClient from './apiClient';

export const recipeApi = {
  // Generate a new recipe
  generateRecipe: async (prompt) => {
    const response = await apiClient.post('/recipes/generate/', {
      prompt,
    });
    return response.data;
  },

  // Get recipe suggestions from pantry
  getPantrySuggestions: async () => {
    const response = await apiClient.get('/recipes/pantry-suggestions/');
    return response.data;
  },

  // Save a recipe
  saveRecipe: async (recipeData) => {
    const response = await apiClient.post('/recipes/saved-recipes/', recipeData);
    return response.data;
  },

  // Get saved recipes
  getSavedRecipes: async () => {
    const response = await apiClient.get('/recipes/saved-recipes/');
    return response.data;
  },

  // Delete a saved recipe
  deleteSavedRecipe: async (recipeId) => {
    const response = await apiClient.delete(`/recipes/saved-recipes/${recipeId}/`);
    return response.data;
  },
};
