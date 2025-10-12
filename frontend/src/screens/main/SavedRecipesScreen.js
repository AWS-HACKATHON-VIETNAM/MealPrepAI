import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useApi } from '../../hooks/useApi';
import { recipeApi } from '../../api/recipeApi';
import RecipeCard from '../../components/feature/RecipeCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const SavedRecipesScreen = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  
  const { loading, execute: fetchSavedRecipes } = useApi();
  const { loading: deleting, execute: deleteRecipe } = useApi();

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    const result = await fetchSavedRecipes(() => recipeApi.getSavedRecipes());
    
    if (result.success) {
      setSavedRecipes(result.data);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to remove this recipe from your saved list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteRecipe(() => 
              recipeApi.deleteSavedRecipe(recipeId)
            );
            
            if (result.success) {
              loadSavedRecipes(); // Refresh the list
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const handleRecipePress = (recipe) => {
    // Navigate to recipe detail screen
    console.log('Navigate to recipe detail:', recipe);
  };

  const renderRecipe = ({ item }) => (
    <RecipeCard
      recipe={item.recipe}
      onPress={() => handleRecipePress(item.recipe)}
      onSave={() => handleDeleteRecipe(item.id)}
      isSaved={true}
    />
  );

  const renderEmptyState = () => (
    <Card style={styles.emptyCard}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>No Saved Recipes</Text>
      <Text style={styles.emptyText}>
        Recipes you save will appear here. Go to the Home tab to generate and save recipes!
      </Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Recipes</Text>
        <Text style={styles.subtitle}>
          {savedRecipes.length} saved recipe{savedRecipes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {loading ? (
        <LoadingSpinner text="Loading saved recipes..." />
      ) : savedRecipes.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={savedRecipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.recipesList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  recipesList: {
    padding: SPACING.md,
  },
  emptyCard: {
    margin: SPACING.md,
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SavedRecipesScreen;
