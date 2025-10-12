from rest_framework import serializers
from ..models import Recipe, UserSavedRecipe


class RecipeSerializer(serializers.ModelSerializer):
    """Serializer for Recipe model"""
    
    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'time_taken_minutes', 'difficulty', 'calories',
            'macros', 'ingredients', 'steps', 'image_url', 'created_at'
        ]
        read_only_fields = ('id', 'source_hash', 'created_at')


class UserSavedRecipeSerializer(serializers.ModelSerializer):
    """Serializer for UserSavedRecipe with nested recipe data"""
    
    recipe = RecipeSerializer(read_only=True)
    
    class Meta:
        model = UserSavedRecipe
        fields = ['id', 'recipe', 'saved_at']
        read_only_fields = ('id', 'saved_at')
