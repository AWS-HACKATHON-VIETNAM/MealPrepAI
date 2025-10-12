"""
WSGI config for personal_chef_project project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'personal_chef_project.settings')

application = get_wsgi_application()
