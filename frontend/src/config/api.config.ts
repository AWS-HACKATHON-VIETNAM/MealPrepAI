export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  TIMEOUT: 30000,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    PROFILE: '/auth/profile/',
    UPDATE_PROFILE: '/auth/profile/update/',
  },
  // Recipes
  RECIPES: {
    GENERATE: '/recipes/generate/',
    PANTRY_SUGGESTIONS: '/recipes/pantry-suggestions/',
    SAVE: '/recipes/saved-recipes/',
    SAVED: '/recipes/saved-recipes/',
    SAVED_BY_ID: (id: number) => `/recipes/saved-recipes/${id}/`,
  },
  // Grocery
  GROCERY: {
    LISTS: '/grocery/grocery-list/',
    LIST_BY_ID: (id: number) => `/grocery/grocery-list/${id}/`,
    ITEMS: '/grocery/grocery-item/',
    ITEM_BY_ID: (id: number) => `/grocery/grocery-item/${id}/`,
    SEARCH: '/grocery/search/',
  },
  // Pantry
  PANTRY: {
    ITEMS: '/pantry/items/',
    ITEM_BY_ID: (id: number) => `/pantry/items/${id}/`,
  },
} as const;
