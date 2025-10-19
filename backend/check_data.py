#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personal_chef_project.settings')
django.setup()

from users.models import User
from api.models import Recipe, UserSavedRecipe

print("=== Database Status ===\n")

# Check users
user_count = User.objects.count()
print(f"Users: {user_count}")
if user_count > 0:
    print("Latest users:")
    for user in User.objects.order_by('-date_joined')[:3]:
        print(f"  - {user.email} (username: {user.username})")

print()

# Check recipes
recipe_count = Recipe.objects.count()
print(f"Recipes: {recipe_count}")
if recipe_count > 0:
    print("Sample recipes:")
    for recipe in Recipe.objects.all()[:3]:
        print(f"  - {recipe.title} (ID: {recipe.id})")

print()

# Check saved recipes
saved_count = UserSavedRecipe.objects.count()
print(f"Saved Recipes: {saved_count}")
if saved_count > 0:
    print("Saved recipe entries:")
    for saved in UserSavedRecipe.objects.select_related('user', 'recipe').all():
        print(f"  - {saved.user.email} saved '{saved.recipe.title}' at {saved.saved_at}")

print("\n✅ Database is ready for testing!")
