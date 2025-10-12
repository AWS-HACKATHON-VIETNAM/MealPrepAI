from django.urls import path
from ..views.grocery_views import (
    search_grocery_items,
    get_grocery_list,
    add_to_grocery_list,
    remove_from_grocery_list
)

urlpatterns = [
    path('search/', search_grocery_items, name='search_grocery_items'),
    path('list/', get_grocery_list, name='get_grocery_list'),
    path('list/', add_to_grocery_list, name='add_to_grocery_list'),
    path('list/<int:item_id>/', remove_from_grocery_list, name='remove_from_grocery_list'),
]
