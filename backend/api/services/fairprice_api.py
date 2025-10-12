import requests
from django.conf import settings


def search_grocery_items(query, limit=10):
    """
    Search for grocery items using FairPrice API
    
    Args:
        query (str): Search query for grocery items
        limit (int): Maximum number of results to return
    
    Returns:
        list: List of grocery items with price and nutritional info
    """
    try:
        # FairPrice API endpoint (replace with actual endpoint)
        api_url = "https://api.fairprice.com.sg/search"
        
        headers = {
            'Authorization': f'Bearer {settings.FAIRPRICE_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        params = {
            'query': query,
            'limit': limit
        }
        
        response = requests.get(api_url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        # Transform the response to match our expected format
        items = []
        for item in data.get('items', []):
            items.append({
                'name': item.get('name', ''),
                'price': float(item.get('price', 0)),
                'unit': item.get('unit', ''),
                'brand': item.get('brand', ''),
                'category': item.get('category', ''),
                'macros': item.get('nutrition', {}),  # Nutritional information
                'image_url': item.get('image_url', ''),
                'availability': item.get('availability', True)
            })
        
        return items
        
    except requests.exceptions.RequestException as e:
        # Fallback to mock data if API is unavailable
        return _get_mock_grocery_data(query, limit)
    except Exception as e:
        raise Exception(f"Grocery search failed: {str(e)}")


def _get_mock_grocery_data(query, limit):
    """Mock data for development/testing when API is unavailable"""
    mock_items = [
        {
            'name': f'{query} - Brand A',
            'price': 5.50,
            'unit': '500g',
            'brand': 'Brand A',
            'category': 'Fresh Produce',
            'macros': {
                'protein': '20g',
                'carbs': '10g',
                'fat': '5g',
                'calories': '150'
            },
            'image_url': '',
            'availability': True
        },
        {
            'name': f'{query} - Premium',
            'price': 7.20,
            'unit': '500g',
            'brand': 'Premium Brand',
            'category': 'Fresh Produce',
            'macros': {
                'protein': '22g',
                'carbs': '8g',
                'fat': '3g',
                'calories': '140'
            },
            'image_url': '',
            'availability': True
        }
    ]
    
    return mock_items[:limit]
