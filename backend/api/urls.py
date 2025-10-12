from django.urls import path, include

urlpatterns = [
    path('recipes/', include('api.urls.recipe_urls')),
    path('grocery/', include('api.urls.grocery_urls')),
    path('profile/', include('users.urls')),
]
