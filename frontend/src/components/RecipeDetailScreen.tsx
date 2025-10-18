import { useState } from 'react';
import { ChevronLeft, Clock, Users, Heart, Play, Timer, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { recipeService } from '../services/recipe.service';
import type { Recipe } from '../types/api.types';
import { Alert } from './ui/alert';

interface RecipeDetailScreenProps {
  recipe: Recipe;
  onBack: () => void;
  onStartCooking: () => void;
}

export function RecipeDetailScreen({ recipe, onBack, onStartCooking }: RecipeDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSaveRecipe = async () => {
    try {
      setIsSaving(true);
      setError('');
      // Convert Recipe to RecipeGenerateResponse format for saving
      const recipeToSave = {
        id: recipe.id,
        name: recipe.name,
        difficulty: recipe.difficulty,
        time_taken_minutes: recipe.time_taken_minutes,
        calories: recipe.calories,
        macros: recipe.macros,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        image_url: recipe.image_url,
        source_hash: recipe.source_hash,
      };
      await recipeService.saveRecipe(recipeToSave);
      setSuccessMessage('Recipe saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col pt-12 bg-white">
      {/* Header Image */}
      <div className="relative h-64 flex-shrink-0">
        <ImageWithFallback
          src={recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={handleSaveRecipe}
          disabled={isSaving}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Heart className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Alerts */}
        {error && (
          <div className="px-6 pt-4">
            <Alert variant="destructive">{error}</Alert>
          </div>
        )}
        {successMessage && (
          <div className="px-6 pt-4">
            <Alert>{successMessage}</Alert>
          </div>
        )}

        {/* Recipe Info */}
        <div className="px-6 py-4">
          <h1 className="text-gray-900 mb-2">{recipe.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.time_taken_minutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>1 serving</span>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs ${
              recipe.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
              recipe.difficulty === 'Medium' ? 'bg-orange-50 text-orange-600' :
              'bg-red-50 text-red-600'
            }`}>
              {recipe.difficulty}
            </div>
          </div>

          {/* Macros */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-orange-600 text-sm">Calories</p>
              <p className="text-gray-900">{recipe.calories}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-blue-600 text-sm">Protein</p>
              <p className="text-gray-900">{recipe.macros.protein}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-green-600 text-sm">Carbs</p>
              <p className="text-gray-900">{recipe.macros.carbs}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'ingredients'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'steps'
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-500'
              }`}
            >
              Steps
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-4">
          {activeTab === 'ingredients' ? (
            <div className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-700">{ingredient.item}</span>
                  <span className="text-gray-500">{ingredient.quantity}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recipe.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-1">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-gray-200">
        <Button
          onClick={onStartCooking}
          className="w-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Cooking
        </Button>
      </div>
    </div>
  );
}
