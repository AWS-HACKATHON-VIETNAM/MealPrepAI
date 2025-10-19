import { useState, useEffect } from 'react';
import { MobileContainer } from './components/MobileContainer';
import { BottomNav } from './components/BottomNav';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { RecipeDetailScreen } from './components/RecipeDetailScreen';
import { CookingModeScreen } from './components/CookingModeScreen';
import { GroceryListScreen } from './components/GroceryListScreen';
import { PantryScreen } from './components/PantryScreen';
import { SavedRecipesScreen } from './components/SavedRecipesScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { useAuth } from './contexts/AuthContext';
import type { Recipe } from './types/api.types';

type Screen = 'login' | 'home' | 'recipeDetail' | 'cooking' | 'grocery' | 'pantry' | 'saved' | 'profile';

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [cookingRecipe, setCookingRecipe] = useState<any>(null);

  // Update current screen based on authentication status
  useEffect(() => {
    if (isAuthenticated && currentScreen === 'login') {
      setCurrentScreen('home');
      setActiveTab('home');
    } else if (!isAuthenticated && currentScreen !== 'login') {
      setCurrentScreen('login');
    }
  }, [isAuthenticated]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <MobileContainer>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </MobileContainer>
    );
  }

  const handleLogin = () => {
    setCurrentScreen('home');
    setActiveTab('home');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'recipes':
        setCurrentScreen('saved');
        break;
      case 'grocery':
        setCurrentScreen('grocery');
        break;
      case 'pantry':
        setCurrentScreen('pantry');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
  };

  const handleRecipeSelect = () => {
    setCurrentScreen('saved');
    setActiveTab('recipes');
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentScreen('recipeDetail');
  };

  const handleStartCooking = () => {
    setCurrentScreen('cooking');
  };

  const handleStartCookingFromHome = (recipe: any) => {
    setCookingRecipe(recipe);
    setCurrentScreen('cooking');
  };

  const handleBackToSaved = () => {
    setCurrentScreen('saved');
    setActiveTab('recipes');
  };

  const handleBackToRecipeDetail = () => {
    setCurrentScreen('recipeDetail');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setActiveTab('home');
  };

  return (
    <MobileContainer>
      {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}
      
      {currentScreen === 'home' && (
        <>
          <HomeScreen 
            onRecipeSelect={handleRecipeSelect}
            onStartCooking={handleStartCookingFromHome}
          />
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}
      
      {currentScreen === 'recipeDetail' && selectedRecipe && (
        <RecipeDetailScreen 
          recipe={selectedRecipe}
          onBack={handleBackToSaved}
          onStartCooking={handleStartCooking}
        />
      )}
      
      {currentScreen === 'cooking' && (
        <CookingModeScreen 
          onBack={cookingRecipe ? handleBackToHome : handleBackToRecipeDetail}
          recipe={cookingRecipe || selectedRecipe}
        />
      )}
      
      {currentScreen === 'grocery' && (
        <>
          <GroceryListScreen />
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}
      
      {currentScreen === 'pantry' && (
        <>
          <PantryScreen />
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}
      
      {currentScreen === 'saved' && (
        <>
          <SavedRecipesScreen onRecipeClick={handleRecipeClick} />
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}
      
      {currentScreen === 'profile' && (
        <>
          <ProfileScreen onNavigateToPantry={() => {
            setCurrentScreen('pantry');
            setActiveTab('pantry');
          }} />
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </>
      )}
    </MobileContainer>
  );
}
