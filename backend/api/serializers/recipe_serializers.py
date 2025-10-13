from rest_framework import serializers
from ..models import Recipe, UserSavedRecipe


class RecipeSerializer(serializers.ModelSerializer):
    """Serializer for Recipe model"""
    
    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'time_taken_minutes', 'difficulty', 'calories',
            'macros', 'ingredients', 'steps', 'image_url', 'source_hash', 'created_at'
        ]
        read_only_fields = ('id', 'source_hash', 'created_at')
    
    def validate_difficulty(self, value):
        # Allow null/blank (model permits it). If provided, enforce choice.
        if value in (None, ""):
            return None
        choices = {c for c, _ in Recipe.DIFFICULTY_CHOICES}
        if value not in choices:
            raise serializers.ValidationError(f"Difficulty must be one of {sorted(choices)}.")
        return value



class UserSavedRecipeSerializer(serializers.ModelSerializer):
    """Serializer for UserSavedRecipe with nested recipe data"""
    
    recipe = RecipeSerializer(read_only=True)
    
    class Meta:
        model = UserSavedRecipe
        fields = ['id', 'recipe', 'saved_at']
        read_only_fields = ('id', 'saved_at')
