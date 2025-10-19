import { apiClient } from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import type { PantryItem, PantryItemCreateRequest } from '../types/api.types';

export const pantryService = {
  // Get all pantry items for the current user
  async getPantryItems(): Promise<PantryItem[]> {
    return await apiClient.get<PantryItem[]>(API_ENDPOINTS.PANTRY.ITEMS);
  },

  // Get a specific pantry item
  async getPantryItem(id: number): Promise<PantryItem> {
    return await apiClient.get<PantryItem>(API_ENDPOINTS.PANTRY.ITEM_BY_ID(id));
  },

  // Add a new pantry item
  async addPantryItem(item: PantryItemCreateRequest): Promise<PantryItem> {
    return await apiClient.post<PantryItem>(API_ENDPOINTS.PANTRY.ITEMS, item);
  },

  // Update a pantry item
  async updatePantryItem(id: number, updates: Partial<PantryItemCreateRequest>): Promise<PantryItem> {
    return await apiClient.put<PantryItem>(API_ENDPOINTS.PANTRY.ITEM_BY_ID(id), updates);
  },

  // Delete a pantry item
  async deletePantryItem(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PANTRY.ITEM_BY_ID(id));
  },
};
