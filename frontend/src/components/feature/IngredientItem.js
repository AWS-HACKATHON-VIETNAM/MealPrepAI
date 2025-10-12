import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const IngredientItem = ({ 
  ingredient, 
  onRemove, 
  onPress, 
  showPrice = false,
  showMacros = false 
}) => {
  const { ingredient_name, quantity, price, macros } = ingredient;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {ingredient_name}
          </Text>
          <Text style={styles.quantity}>{quantity}</Text>
        </View>
        
        <View style={styles.additionalInfo}>
          {showPrice && price && (
            <Text style={styles.price}>${price.toFixed(2)}</Text>
          )}
          
          {showMacros && macros && (
            <View style={styles.macros}>
              <Text style={styles.macroText}>
                {macros.calories && `${macros.calories} cal`}
              </Text>
            </View>
          )}
        </View>
        
        {onRemove && (
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={() => onRemove(ingredient)}
          >
            <Text style={styles.removeText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  mainInfo: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  quantity: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  additionalInfo: {
    alignItems: 'flex-end',
    marginRight: SPACING.sm,
  },
  price: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  macros: {
    alignItems: 'flex-end',
  },
  macroText: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IngredientItem;
