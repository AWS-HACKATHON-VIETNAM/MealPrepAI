import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Heart, ChevronLeft, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { recipeService } from '../services/recipe.service';
import type { Recipe } from '../types/api.types';
import { Alert } from './ui/alert';

interface RecipeListScreenProps {
  onRecipeClick: (recipe: Recipe) => void;
  onBack?: () => void;
}

export function RecipeListScreen({ onRecipeClick, onBack }: RecipeListScreenProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await recipeService.getSavedRecipes();
      setRecipes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (recipeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement favorite toggle when backend supports it
    console.log('Toggle favorite:', recipeId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-orange-600 bg-orange-50';
      case 'Hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-12 pb-20 bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1 -ml-1">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
          )}
          <div className="flex-1">
            <h2 className="text-gray-900">Saved Recipes</h2>
            <p className="text-gray-500 text-sm">{recipes.length} recipes saved</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-6 py-4">
          <Alert variant="destructive">{error}</Alert>
        </div>
      )}

      {/* Recipe List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No recipes saved yet</p>
            <p className="text-gray-400 text-sm mt-2">Generate and save recipes to see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => onRecipeClick(recipe)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <ImageWithFallback
                    src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={(e) => handleToggleFavorite(recipe.id, e)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <Heart className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-gray-900 mb-2">{recipe.name}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.time_taken_minutes} min</span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(
                        recipe.difficulty
                      )}`}
                    >
                      {recipe.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>{recipe.calories} cal</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {recipe.macros.protein} protein
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
