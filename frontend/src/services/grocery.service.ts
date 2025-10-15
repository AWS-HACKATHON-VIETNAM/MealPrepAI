import { apiClient } from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api.config';
import type {
  GroceryList,
  GroceryItem,
  GroceryItemCreateRequest,
} from '../types/api.types';

export const groceryService = {
  // Get all grocery lists for the current user
  async getGroceryLists(): Promise<GroceryList[]> {
    return await apiClient.get<GroceryList[]>(API_ENDPOINTS.GROCERY.LISTS);
  },

  // Get a specific grocery list by ID
  async getGroceryList(id: number): Promise<GroceryList> {
    return await apiClient.get<GroceryList>(API_ENDPOINTS.GROCERY.LIST_BY_ID(id));
  },

  // Create a new grocery list
  async createGroceryList(name: string): Promise<GroceryList> {
    return await apiClient.post<GroceryList>(API_ENDPOINTS.GROCERY.LISTS, { name });
  },

  // Update a grocery list name
  async updateGroceryList(id: number, name: string): Promise<GroceryList> {
    return await apiClient.put<GroceryList>(API_ENDPOINTS.GROCERY.LIST_BY_ID(id), { name });
  },

  // Delete a grocery list
  async deleteGroceryList(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.GROCERY.LIST_BY_ID(id));
  },

  // Get grocery items (optionally filtered by list)
  async getGroceryItems(groceryListId?: number): Promise<GroceryItem[]> {
    const endpoint = groceryListId
      ? `${API_ENDPOINTS.GROCERY.ITEMS}?grocery_list=${groceryListId}`
      : API_ENDPOINTS.GROCERY.ITEMS;
    return await apiClient.get<GroceryItem[]>(endpoint);
  },

  // Add a new grocery item
  async addGroceryItem(item: GroceryItemCreateRequest): Promise<GroceryItem> {
    return await apiClient.post<GroceryItem>(API_ENDPOINTS.GROCERY.ITEMS, item);
  },

  // Update a grocery item
  async updateGroceryItem(id: number, updates: Partial<GroceryItem>): Promise<GroceryItem> {
    return await apiClient.put<GroceryItem>(API_ENDPOINTS.GROCERY.ITEM_BY_ID(id), updates);
  },

  // Delete a grocery item
  async deleteGroceryItem(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.GROCERY.ITEM_BY_ID(id));
  },

  // Search for grocery items from external API
  async searchGroceryItem(query: string): Promise<any> {
    return await apiClient.get(`${API_ENDPOINTS.GROCERY.SEARCH}?q=${encodeURIComponent(query)}`);
  },
};
