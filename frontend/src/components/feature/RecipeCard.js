import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Card from '../common/Card';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';
import { formatTime, formatCalories } from '../../utils/helpers';

const RecipeCard = ({ recipe, onPress, onSave, isSaved = false }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        {recipe.image_url && (
          <Image source={{ uri: recipe.image_url }} style={styles.image} />
        )}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.name}
          </Text>
          
          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Time</Text>
              <Text style={styles.metaValue}>
                {formatTime(recipe.time_taken_minutes)}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Difficulty</Text>
              <Text style={styles.metaValue}>{recipe.difficulty}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Calories</Text>
              <Text style={styles.metaValue}>
                {formatCalories(recipe.calories)}
              </Text>
            </View>
          </View>
          
          {recipe.macros && (
            <View style={styles.macros}>
              <Text style={styles.macroItem}>
                P: {recipe.macros.protein || 'N/A'}
              </Text>
              <Text style={styles.macroItem}>
                C: {recipe.macros.carbs || 'N/A'}
              </Text>
              <Text style={styles.macroItem}>
                F: {recipe.macros.fat || 'N/A'}
              </Text>
            </View>
          )}
          
          {onSave && (
            <TouchableOpacity
              style={[styles.saveButton, isSaved && styles.savedButton]}
              onPress={onSave}
            >
              <Text style={[styles.saveText, isSaved && styles.savedText]}>
                {isSaved ? 'Saved' : 'Save Recipe'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  metaValue: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
  },
  macros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  macroItem: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  savedButton: {
    backgroundColor: COLORS.success,
  },
  saveText: {
    color: COLORS.surface,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
  },
  savedText: {
    color: COLORS.surface,
  },
});

export default RecipeCard;
