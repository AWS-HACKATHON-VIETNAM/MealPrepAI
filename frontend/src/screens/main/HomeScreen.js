import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput as RNTextInput,
} from 'react-native';
import { useApi } from '../../hooks/useApi';
import { recipeApi } from '../../api/recipeApi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import RecipeCard from '../../components/feature/RecipeCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const HomeScreen = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [pantrySuggestions, setPantrySuggestions] = useState([]);
  
  const { loading: generating, execute: generateRecipe } = useApi();
  const { loading: suggesting, execute: getSuggestions } = useApi();

  const handleGenerateRecipe = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a recipe prompt');
      return;
    }

    const result = await generateRecipe(() => recipeApi.generateRecipe(prompt));
    
    if (result.success) {
      setGeneratedRecipe(result.data);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleGetPantrySuggestions = async () => {
    const result = await getSuggestions(() => recipeApi.getPantrySuggestions());
    
    if (result.success) {
      setPantrySuggestions(result.data);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      await recipeApi.saveRecipe(recipe);
      Alert.alert('Success', 'Recipe saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save recipe');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Personal Chef</Text>
        <Text style={styles.subtitle}>Generate personalized recipes with AI</Text>
      </View>

      <Card style={styles.recipeGenerator}>
        <Text style={styles.sectionTitle}>Generate Recipe</Text>
        <RNTextInput
          style={styles.promptInput}
          placeholder="Describe the recipe you want (e.g., 'healthy vegan lunch under 400 calories')"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          numberOfLines={3}
        />
        <Button
          title="Generate Recipe"
          onPress={handleGenerateRecipe}
          loading={generating}
          style={styles.generateButton}
        />
      </Card>

      <Card style={styles.pantrySection}>
        <Text style={styles.sectionTitle}>Pantry Suggestions</Text>
        <Text style={styles.sectionDescription}>
          Get recipe suggestions based on ingredients in your grocery list
        </Text>
        <Button
          title="Get Suggestions"
          variant="secondary"
          onPress={handleGetPantrySuggestions}
          loading={suggesting}
          style={styles.suggestButton}
        />
      </Card>

      {generating && (
        <LoadingSpinner text="Generating your personalized recipe..." />
      )}

      {generatedRecipe && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Generated Recipe</Text>
          <RecipeCard
            recipe={generatedRecipe}
            onSave={() => handleSaveRecipe(generatedRecipe)}
            onPress={() => {
              // Navigate to recipe detail screen
              console.log('Navigate to recipe detail');
            }}
          />
        </View>
      )}

      {pantrySuggestions.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Pantry Suggestions</Text>
          {pantrySuggestions.map((recipe, index) => (
            <RecipeCard
              key={index}
              recipe={recipe}
              onSave={() => handleSaveRecipe(recipe)}
              onPress={() => {
                // Navigate to recipe detail screen
                console.log('Navigate to recipe detail');
              }}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
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
  recipeGenerator: {
    marginBottom: SPACING.lg,
  },
  pantrySection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sectionDescription: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  promptInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
    textAlignVertical: 'top',
  },
  generateButton: {
    marginBottom: 0,
  },
  suggestButton: {
    marginBottom: 0,
  },
  resultsSection: {
    marginTop: SPACING.lg,
  },
});

export default HomeScreen;
