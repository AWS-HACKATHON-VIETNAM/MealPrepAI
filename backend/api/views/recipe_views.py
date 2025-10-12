from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from ..models import Recipe, UserSavedRecipe
from ..serializers import RecipeSerializer, UserSavedRecipeSerializer
from ..services.aws_bedrock import generate_recipe as bedrock_generate_recipe, suggest_recipes_from_pantry as bedrock_suggest_recipes


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_recipe(request):
    """Generate a new recipe using AI"""
    prompt = request.data.get('prompt')
    
    if not prompt:
        return Response(
            {'error': 'Prompt is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Get user profile data
        user_profile = {
            'weight_kg': request.user.profile.weight_kg,
            'height_cm': request.user.profile.height_cm,
            'goal': request.user.profile.goal,
            'preferences': request.user.profile.preferences,
            'allergies': request.user.profile.allergies,
        }
        
        # Generate recipe using AWS Bedrock
        recipe_data = bedrock_generate_recipe(prompt, user_profile)
        
        return Response(recipe_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Recipe generation failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def suggest_recipes_from_pantry(request):
    """Suggest recipes based on user's grocery list"""
    try:
        # Get user's grocery list
        grocery_items = list(request.user.usergrocerylist_set.values(
            'ingredient_name', 'quantity'
        ))
        
        if not grocery_items:
            return Response(
                {'error': 'No items in grocery list'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate recipe suggestions
        recipes_data = bedrock_suggest_recipes(grocery_items)
        
        return Response(recipes_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Recipe suggestion failed: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_recipe(request):
    """Save a generated recipe"""
    try:
        recipe_data = request.data
        
        # Check if recipe with same source_hash already exists
        recipe, created = Recipe.objects.get_or_create(
            source_hash=recipe_data.get('source_hash', ''),
            defaults=recipe_data
        )
        
        # Create user-saved-recipe relationship
        saved_recipe, created = UserSavedRecipe.objects.get_or_create(
            user=request.user,
            recipe=recipe
        )
        
        if created:
            return Response(
                {'message': 'Recipe saved successfully'}, 
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'message': 'Recipe already saved'}, 
                status=status.HTTP_200_OK
            )
            
    except Exception as e:
        return Response(
            {'error': f'Failed to save recipe: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_recipes(request):
    """Get all recipes saved by the user"""
    try:
        saved_recipes = UserSavedRecipe.objects.filter(user=request.user).order_by('-saved_at')
        serializer = UserSavedRecipeSerializer(saved_recipes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to retrieve saved recipes: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_saved_recipe(request, recipe_id):
    """Remove a saved recipe from user's list"""
    try:
        saved_recipe = get_object_or_404(
            UserSavedRecipe, 
            user=request.user, 
            recipe_id=recipe_id
        )
        saved_recipe.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to delete saved recipe: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
