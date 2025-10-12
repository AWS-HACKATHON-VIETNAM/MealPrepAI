from django.contrib import admin
from .models import Recipe, UserSavedRecipe, GroceryList, MealHistory


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "difficulty",
        "time_taken_minutes",
        "calories",
        "created_at",
    )
    list_filter = ("difficulty", "created_at")
    search_fields = ("name", "ingredients")
    readonly_fields = ("created_at",)


@admin.register(UserSavedRecipe)
class UserSavedRecipeAdmin(admin.ModelAdmin):
    list_display = ("user", "recipe", "saved_at")
    list_filter = ("saved_at",)
    search_fields = ("user__email", "recipe__name")


@admin.register(GroceryList)
class GroceryListAdmin(admin.ModelAdmin):
    list_display = ("user", "ingredient_name", "quantity", "price", "added_at")
    list_filter = ("added_at",)
    search_fields = ("user__email", "ingredient_name")


@admin.register(MealHistory)
class MealHistoryAdmin(admin.ModelAdmin):
    list_display = ("user", "recipe_name", "calories_consumed", "eaten_at")
    list_filter = ("eaten_at",)
    search_fields = ("user__email", "recipe_name")
