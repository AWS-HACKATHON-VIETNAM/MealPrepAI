#!/usr/bin/env python
"""
Test registration endpoint with exact frontend data
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, '/home/uylulu/AWS/MealPrepAI/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personal_chef_project.settings')
django.setup()

from users.serializers import UserRegistrationSerializer
import json

def main():
    print("\n" + "=" * 70)
    print("TESTING REGISTRATION SERIALIZER")
    print("=" * 70)

    # Test cases that match frontend scenarios
    test_cases = [
        {
            "name": "With first_name and last_name",
            "data": {
                'email': 'test@example.com',
                'password': 'TestPass123!',
                'password_confirm': 'TestPass123!',
                'first_name': 'John',
                'last_name': 'Doe'
            }
        },
        {
            "name": "With undefined (not sent)",
            "data": {
                'email': 'test2@example.com',
                'password': 'TestPass123!',
                'password_confirm': 'TestPass123!'
            }
        },
        {
            "name": "With empty strings",
            "data": {
                'email': 'test3@example.com',
                'password': 'TestPass123!',
                'password_confirm': 'TestPass123!',
                'first_name': '',
                'last_name': ''
            }
        }
    ]

    for test_case in test_cases:
        print(f"\n{'-' * 70}")
        print(f"Test: {test_case['name']}")
        print(f"{'-' * 70}")
        print(f"Input data: {json.dumps(test_case['data'], indent=2)}")

        serializer = UserRegistrationSerializer(data=test_case['data'])

        if serializer.is_valid():
            print("✅ VALIDATION: PASSED")
            print(f"Validated data: {serializer.validated_data}")
        else:
            print("❌ VALIDATION: FAILED")
            print(f"Errors: {json.dumps(serializer.errors, indent=2)}")

    print("\n" + "=" * 70)
    print("TEST COMPLETE")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
