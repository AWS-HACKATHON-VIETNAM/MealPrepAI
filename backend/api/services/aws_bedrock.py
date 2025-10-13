import json
import boto3
from django.conf import settings
from botocore.exceptions import ClientError


def get_bedrock_client():
    """Initialize and return AWS Bedrock client"""
    return boto3.client(
        'bedrock-runtime',
        region_name=settings.AWS_BEDROCK_REGION
    )


def generate_recipe(prompt, user_profile=None):
    """
    Generate a recipe using AWS Bedrock
    
    Args:
        prompt (str): User's recipe request
        user_profile (dict): User's profile data including preferences and allergies
    
    Returns:
        dict: Generated recipe data
    """
    try:
        # Construct detailed prompt including user data
        full_prompt = f"""
        Generate a recipe based on the following request: {prompt}
        
        User Profile:
        - Weight: {user_profile.get('weight_kg', 'Not specified')} kg
        - Height: {user_profile.get('height_cm', 'Not specified')} cm
        - Goal: {user_profile.get('goal', 'Not specified')}
        - Preferences: {', '.join(user_profile.get('preferences', []))}
        - Allergies: {', '.join(user_profile.get('allergies', []))}
        
        Please return a JSON object with the following structure:
        {{
            "name": "Recipe Name",
            "time_taken_minutes": 30,
            "difficulty": "Easy",
            "calories": 400,
            "macros": {{
                "protein": "25g",
                "carbs": "45g",
                "fat": "12g"
            }},
            "ingredients": [
                {{"item": "Ingredient Name", "amount": "500", "unit": "g"}}
            ],
            "steps": [
                "Step 1: ...",
                "Step 2: ..."
            ]
        }}
        
        Make sure to consider the user's preferences and avoid any allergens.
        """
        
        client = get_bedrock_client()
        
        # Prepare the request body for Bedrock
        body = json.dumps({
            "messages": [
                {
                    "role": "user",
                    "content": full_prompt
                }
            ],
            "max_tokens": 2000,       # now correct field name for Messages API
            "temperature": 0.7,
            "top_p": 0.9,
            "anthropic_version": "bedrock-2023-05-31",
        })
        
        # Call Bedrock (replace 'model-id' with your actual model ID)
        response = client.invoke_model(
            modelId='anthropic.claude-3-sonnet-20240229-v1:0',  # Replace with your model
            body=body,
            contentType='application/json',
                accept="application/json"
        )
        
        # Parse the response
        response_body = json.loads(response['body'].read())
        model_output = response_body["content"][0]["text"]
        recipe_data = json.loads(model_output)
        
        return recipe_data
        
    except ClientError as e:
        raise Exception(f"AWS Bedrock error: {str(e)}")
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse recipe response: {str(e)}")
    except Exception as e:
        raise Exception(f"Recipe generation failed: {str(e)}")


def suggest_recipes_from_pantry(grocery_items):
    """
    Suggest recipes based on available ingredients
    
    Args:
        grocery_items (list): List of grocery items from user's pantry
    
    Returns:
        list: List of suggested recipe data
    """
    try:
        # Format grocery items for the prompt
        ingredients_text = ", ".join([item['ingredient_name'] for item in grocery_items])
        
        full_prompt = f"""
        Suggest 2-3 recipes that can be made with these ingredients: {ingredients_text}
        
        Please return a JSON array with the following structure:
        [
            {{
                "name": "Recipe Name",
                "time_taken_minutes": 30,
                "difficulty": "Easy",
                "calories": 400,
                "macros": {{
                    "protein": "25g",
                    "carbs": "45g",
                    "fat": "12g"
                }},
                "ingredients": [
                    {{"item": "Ingredient Name", "amount": "500", "unit": "g"}}
                ],
                "steps": [
                    "Step 1: ...",
                    "Step 2: ..."
                ]
            }}
        ]
        
        Only use ingredients from the provided list and common pantry staples.
        """
        
        client = get_bedrock_client()
        
        body = json.dumps({
            "messages": [
                {
                    "role": "user",
                    "content": full_prompt
                }
            ],
            "max_tokens": 3000,       # now correct field name for Messages API
            "temperature": 0.7,
            "top_p": 0.9,
            "anthropic_version": "bedrock-2023-05-31",
        })
        
        response = client.invoke_model(
            modelId='anthropic.claude-3-sonnet-20240229-v1:0',  # Replace with your model
            body=body,
            contentType='application/json'
        )
        
        response_body = json.loads(response['body'].read())
        model_output = response_body["content"][0]["text"]
        recipes_data = json.loads(model_output)
        
        return recipes_data
        
    except ClientError as e:
        raise Exception(f"AWS Bedrock error: {str(e)}")
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse recipes response: {str(e)}")
    except Exception as e:
        raise Exception(f"Recipe suggestion failed: {str(e)}")
