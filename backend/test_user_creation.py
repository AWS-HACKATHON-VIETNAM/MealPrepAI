#!/usr/bin/env python
"""
Test full user creation flow
"""
import os
import sys
import django

sys.path.insert(0, '/home/uylulu/AWS/MealPrepAI/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personal_chef_project.settings')
django.setup()

from users.serializers import UserRegistrationSerializer
from users.models import User, UserProfile
import json

print("\n" + "="*70)
print("TESTING FULL USER CREATION FLOW")
print("="*70)

test_data = {
    'email': 'testuser@example.com',
    'password': 'TestPass123!',
    'password_confirm': 'TestPass123!',
    'first_name': 'Test',
    'last_name': 'User'
}

print(f"\nAttempting to create user with data:")
print(json.dumps(test_data, indent=2))

# Step 1: Validate
print("\n" + "-"*70)
print("Step 1: Validation")
print("-"*70)
serializer = UserRegistrationSerializer(data=test_data)

if not serializer.is_valid():
    print("❌ Validation failed:")
    print(json.dumps(serializer.errors, indent=2))
    sys.exit(1)

print("✅ Validation passed")

# Step 2: Try to create user
print("\n" + "-"*70)
print("Step 2: Create User")
print("-"*70)

try:
    # Delete existing test user if exists
    User.objects.filter(email='testuser@example.com').delete()
    
    user = serializer.save()
    print(f"✅ User created successfully:")
    print(f"   ID: {user.id}")
    print(f"   Email: {user.email}")
    print(f"   Username: {user.username}")
    print(f"   First name: {user.first_name}")
    print(f"   Last name: {user.last_name}")
    
    # Check profile
    try:
        profile = UserProfile.objects.get(user=user)
        print(f"\n✅ UserProfile created successfully:")
        print(f"   ID: {profile.id}")
    except UserProfile.DoesNotExist:
        print(f"\n❌ UserProfile was NOT created!")
    
except Exception as e:
    print(f"❌ User creation failed:")
    print(f"   Error type: {type(e).__name__}")
    print(f"   Error message: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "="*70)
print("TEST COMPLETE")
print("="*70 + "\n")
