import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Loader2, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { recipeService } from '../services/recipe.service';
import type { Recipe } from '../types/api.types';
import { Alert } from './ui/alert';
import { Input } from './ui/input';

interface SavedRecipesScreenProps {
  onRecipeClick: (recipe: Recipe) => void;
}

interface SavedRecipeItem {
  id: number;
  recipe: Recipe;
  saved_at: string;
}

export function SavedRecipesScreen({ onRecipeClick }: SavedRecipesScreenProps) {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await recipeService.getSavedRecipes();
      console.log('Loaded saved recipes:', data);
      setSavedRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load saved recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this recipe from your saved list?')) {
      return;
    }
    
    try {
      setDeletingId(recipeId);
      console.log('Deleting UserSavedRecipe with ID:', recipeId);
      await recipeService.deleteSavedRecipe(recipeId);
      setSavedRecipes(savedRecipes.filter(r => r.recipe.id !== recipeId));
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter recipes based on search query
  const filteredRecipes = savedRecipes.filter(item =>
    item.recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading saved recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-12 pb-20 bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-gray-900 mb-1">Saved Recipes</h2>
        <p className="text-gray-500 text-sm mb-3">{savedRecipes.length} favorite recipes</p>
        
        {/* Search Bar */}
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes by name..."
          className="w-full"
        />
      </div>

      {error && (
        <div className="px-6 py-4">
          <Alert variant="destructive">{error}</Alert>
        </div>
      )}

      {/* Recipe Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            {searchQuery ? (
              <>
                <p className="text-gray-500">No recipes found matching "{searchQuery}"</p>
                <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
              </>
            ) : savedRecipes.length === 0 ? (
              <>
                <p className="text-gray-500">No saved recipes yet</p>
                <p className="text-gray-400 text-sm mt-2">Save your favorite recipes to see them here</p>
              </>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecipes.map((item) => (
              <div
                key={item.id}
                onClick={() => onRecipeClick(item.recipe)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={item.recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                    alt={item.recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={(e) => handleDeleteRecipe(item.recipe.id, e)}
                      disabled={deletingId === item.recipe.id}
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50"
                    >
                      {deletingId === item.recipe.id ? (
                        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 mb-2">{item.recipe.name}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{item.recipe.time_taken_minutes} min</span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.recipe.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                        item.recipe.difficulty === 'Medium' ? 'bg-orange-50 text-orange-600' :
                        'bg-red-50 text-red-600'
                      }`}
                    >
                      {item.recipe.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>{item.recipe.calories} cal</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.recipe.macros.protein} protein
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
