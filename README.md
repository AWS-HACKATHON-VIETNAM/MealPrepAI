# Personal Chef App

A full-stack application that provides personalized recipe generation using AI, built with Django (backend) and React Native (frontend).

## Features

- **AI-Powered Recipe Generation**: Generate personalized recipes based on user preferences, dietary restrictions, and health goals
- **Grocery List Management**: Search and manage ingredients with pricing and nutritional information
- **Recipe Saving**: Save and organize favorite recipes
- **User Profiles**: Track personal preferences, allergies, and health goals
- **Pantry Suggestions**: Get recipe recommendations based on available ingredients

## Tech Stack

### Backend (Django)
- Django 4.2.7
- Django REST Framework
- PostgreSQL
- JWT Authentication
- AWS Bedrock (AI Integration)
- FairPrice API Integration

### Frontend (React Native)
- React Native with Expo
- React Navigation
- Context API for State Management
- Axios for API calls
- AsyncStorage for local storage

## Project Structure

```
personal-chef-app/
├── backend/                    # Django Backend
│   ├── personal_chef_project/  # Main Django project
│   ├── users/                  # User authentication & profiles
│   ├── api/                    # Core API features
│   ├── manage.py
│   └── requirements.txt
├── frontend/                   # React Native Frontend
│   ├── src/
│   │   ├── api/               # API client & endpoints
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── navigation/        # Navigation configuration
│   │   ├── screens/           # Screen components
│   │   ├── state/             # Context providers
│   │   └── utils/             # Utilities & constants
│   ├── App.js
│   ├── package.json
│   └── babel.config.js
└── README.md
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd personal-chef-app/backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up PostgreSQL database:**
   - Install PostgreSQL
   - Create database: `personal_chef_db`
   - Update database settings in `personal_chef_project/settings.py`

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server:**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd personal-chef-app/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Expo development server:**
   ```bash
   npm start
   ```

4. **Run on device/simulator:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on physical device

## API Endpoints

### Authentication
- `POST /api/v1/auth/register/` - User registration
- `POST /api/v1/auth/login/` - User login
- `GET /api/v1/profile/` - Get user profile
- `PUT /api/v1/profile/update/` - Update user profile

### Recipes
- `POST /api/v1/recipes/generate/` - Generate AI recipe
- `GET /api/v1/recipes/pantry-suggestions/` - Get pantry suggestions
- `POST /api/v1/recipes/saved-recipes/` - Save recipe
- `GET /api/v1/recipes/saved-recipes/` - Get saved recipes
- `DELETE /api/v1/recipes/saved-recipes/{id}/` - Delete saved recipe

### Grocery
- `GET /api/v1/grocery/search/` - Search grocery items
- `GET /api/v1/grocery/list/` - Get grocery list
- `POST /api/v1/grocery/list/` - Add to grocery list
- `DELETE /api/v1/grocery/list/{id}/` - Remove from grocery list

## Environment Variables

### Backend
Create a `.env` file in the backend directory:
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/personal_chef_db
AWS_BEDROCK_REGION=us-east-1
FAIRPRICE_API_KEY=your-fairprice-api-key
```

### Frontend
Update `src/utils/constants.js` with your backend URL:
```javascript
export const API_BASE_URL = 'http://your-backend-url:8000/api/v1';
```

## Database Schema

### Users
- `users` - User authentication data
- `user_profiles` - Personal information and preferences

### Recipes
- `recipes` - Recipe details and metadata
- `user_saved_recipes` - User-recipe relationships

### Grocery
- `user_grocery_list` - User's grocery items and pantry

### History
- `meal_history` - Track consumed meals and nutrition

## Development

### Backend Development
- Use Django admin at `http://localhost:8000/admin/`
- API documentation available at `http://localhost:8000/api/`
- Run tests: `python manage.py test`

### Frontend Development
- Use React Native Debugger for debugging
- Hot reload enabled by default
- Check Metro bundler logs for build issues

## Deployment

### Backend Deployment
1. Set `DEBUG=False` in production
2. Use environment variables for sensitive data
3. Configure static file serving
4. Set up SSL certificates
5. Use a production database (PostgreSQL on cloud)

### Frontend Deployment
1. Build production bundle: `expo build:android/ios`
2. Submit to app stores
3. Configure push notifications if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.
