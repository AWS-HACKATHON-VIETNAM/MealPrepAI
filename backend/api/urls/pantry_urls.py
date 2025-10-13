from django.urls import path

from api.views import pantry_items, pantry_item_detail


urlpatterns = [
    path("items/", pantry_items, name="pantry_items"),
    path("items/<int:item_id>/", pantry_item_detail, name="pantry_item_detail"),
]
