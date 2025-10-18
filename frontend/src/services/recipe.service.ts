import { apiClient } from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import type {
  Recipe,
  RecipeGenerateRequest,
  RecipeGenerateResponse,
} from '../types/api.types';

export const recipeService = {
  // Generate a recipe from AI based on prompt
  async generateRecipe(request: RecipeGenerateRequest): Promise<RecipeGenerateResponse> {
    return await apiClient.post<RecipeGenerateResponse>(
      API_ENDPOINTS.RECIPES.GENERATE,
      request
    );
  },

  // Get recipe suggestions based on pantry items
  async getPantrySuggestions(): Promise<Recipe[]> {
    return await apiClient.get<Recipe[]>(API_ENDPOINTS.RECIPES.PANTRY_SUGGESTIONS);
  },

  // Get all saved recipes for the current user
  // Backend returns UserSavedRecipe[] with nested recipe objects
  async getSavedRecipes(): Promise<Array<{ id: number; recipe: Recipe; saved_at: string }>> {
    return await apiClient.get<Array<{ id: number; recipe: Recipe; saved_at: string }>>(
      API_ENDPOINTS.RECIPES.SAVED
    );
  },

  // Save a recipe to user's collection
  async saveRecipe(recipe: RecipeGenerateResponse): Promise<{ message: string }> {
    return await apiClient.post<{ message: string }>(API_ENDPOINTS.RECIPES.SAVE, recipe);
  },

  // Delete a saved recipe
  async deleteSavedRecipe(recipeId: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.RECIPES.SAVED_BY_ID(recipeId));
  },
};
