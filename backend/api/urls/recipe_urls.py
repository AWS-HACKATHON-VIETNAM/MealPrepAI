from django.urls import path
from ..views.recipe_views import (
    generate_recipe, 
    suggest_recipes_from_pantry,
    save_recipe,
    get_saved_recipes,
    delete_saved_recipe
)

urlpatterns = [
    path('generate/', generate_recipe, name='generate_recipe'),
    path('pantry-suggestions/', suggest_recipes_from_pantry, name='pantry_suggestions'),
    path('saved-recipes/', get_saved_recipes, name='get_saved_recipes'),
    path('saved-recipes/', save_recipe, name='save_recipe'),
    path('saved-recipes/<int:recipe_id>/', delete_saved_recipe, name='delete_saved_recipe'),
]
