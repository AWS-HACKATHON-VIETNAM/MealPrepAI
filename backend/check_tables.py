#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personal_chef_project.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("""
        SELECT tablename 
        FROM pg_tables 
        WHERE tablename LIKE 'api_%' 
        ORDER BY tablename
    """)
    tables = cursor.fetchall()
    
print("API Tables found:")
for table in tables:
    print(f"  - {table[0]}")
