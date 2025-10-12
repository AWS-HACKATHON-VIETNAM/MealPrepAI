from django.urls import path
from ..views.grocery_views import (
    search_grocery_items,
    grocery_lists,
    grocery_list_detail,
    grocery_items,
    grocery_item_detail,
)

urlpatterns = [
    path("search/", search_grocery_items, name="search_grocery_items"),
    path("grocery-list/", grocery_lists, name="grocery_lists"),
    path(
        "grocery-list/<int:list_id>/", grocery_list_detail, name="grocery_list_detail"
    ),
    path("grocery-item/", grocery_items, name="grocery_items"),
    path(
        "grocery-item/<int:item_id>/", grocery_item_detail, name="grocery_item_detail"
    ),
]
