// Type definitions for backend API models (matching Dishly backend)

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface UserProfile {
  email: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female' | 'other';
  weight_kg: number | null;
  height_cm: number | null;
  preferences: string[]; // Array of food preferences
  allergies: string[]; // Array of allergies
  goal: string | null;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterResponse {
  message: string;
  access: string;
  refresh: string;
}

export interface Recipe {
  id: number;
  name: string;
  time_taken_minutes: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  ingredients: Array<{
    item: string;
    quantity: string;
  }>;
  steps: string[];
  image_url?: string;
  source_hash: string;
}

export interface RecipeGenerateRequest {
  prompt: string;
}

export interface RecipeGenerateResponse {
  id: number;
  name: string;
  time_taken_minutes: number;
  difficulty: string;
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  ingredients: Array<{
    item: string;
    quantity: string;
  }>;
  steps: string[];
  image_url?: string;
}

export interface GroceryList {
  id: number;
  name: string;
  user_id?: number;  // Optional - not returned by backend serializer
  created_at: string;
  items?: GroceryItem[];
}

export interface GroceryItem {
  id: number;
  grocery_list: number;  // Backend uses 'grocery_list', not 'grocery_list_id'
  ingredient: string;
  quantity: string;
  price?: number;
  macros?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  created_at: string;
}

export interface GroceryItemCreateRequest {
  grocery_list: number;  // Match GroceryItem field name
  ingredient: string;
  quantity: string;
  price?: number;
  macros?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
}

export interface PantryItem {
  id: number;
  user_id?: number;  // Optional - not returned by backend serializer
  name: string;
  notes?: string;
  created_at: string;
  updated_at?: string;  // Backend includes this field
}

export interface PantryItemCreateRequest {
  name: string;
  notes?: string;
}

export interface MealHistory {
  id: number;
  user_id: number;
  recipe_name: string;
  calories_consumed: number;
  macros_consumed: {
    protein: string;
    carbs: string;
    fat: string;
  };
  eaten_at: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}
