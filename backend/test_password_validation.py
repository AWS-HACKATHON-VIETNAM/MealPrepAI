#!/usr/bin/env python
import os
import sys
import django

sys.path.insert(0, '/home/uylulu/AWS/MealPrepAI/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personal_chef_project.settings')
django.setup()

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

def main():
    print("\n" + "=" * 70)
    print("PASSWORD VALIDATION TEST")
    print("=" * 70)

    test_passwords = ['123123', 'password', 'SecurePass123!', 'MyPass2024!']

    for pwd in test_passwords:
        print(f"\nPassword: '{pwd}'")
        print("-" * 60)
        try:
            validate_password(pwd)
            print("✅ VALID - This password meets all requirements")
        except ValidationError as err:
            print("❌ INVALID - Validation errors:")
            for error in err.messages:
                print(f"   • {error}")

    print("\n" + "=" * 70 + "\n")


if __name__ == "__main__":
    main()
