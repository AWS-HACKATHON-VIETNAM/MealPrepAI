# MealPrepAI Backend

MealPrepAI is a Django REST API that powers recipe generation, grocery management, and nutrition tracking features for the mobile client. The backend is organised into two Django apps:

- `users`: custom user model, JWT authentication, and profile management
- `api`: recipe generation, saved recipes, grocery list, and historical meal logs

## How the Pieces Fit Together

- **User registration/sign-in** happens through `users.views`. New accounts create both a `User` and an associated `UserProfile`, and successful calls return SimpleJWT access/refresh tokens.
- **Profile data** (goals, preferences, allergies) is stored on `UserProfile` and is pulled into downstream requests so AI-generated recipes can respect dietary needs.
- **Recipe endpoints** in `api.views.recipe_views` call out to AWS Bedrock through `api.services.aws_bedrock`. Responses are expected to be JSON payloads describing a single recipe or a small list of recipes, which are then stored in the local `Recipe` and `UserSavedRecipe` tables when persisted.
- **Grocery endpoints** in `api.views.grocery_views` search the FairPrice API (or fall back to mock data) and maintain the `UserGroceryList` table so pantry contents can be reused for recipe suggestions.
- **Database access** is handled entirely by Django’s ORM. PostgreSQL connection settings are loaded from the `.env` file and initialised when the project boots.

## Prerequisites

- Python 3.11 (or any CPython 3.10+ build compatible with Django 4.2)
- PostgreSQL 13+ running locally with a user that can create databases
- (Optional) AWS credentials with Bedrock access if you want real recipe generation
- (Optional) A FairPrice API key for live grocery searches

## Local Environment Setup

1. **Clone and enter the backend directory**
   ```bash
   git clone <repo-url>
   cd MealPrepAI/backend
   ```

2. **Create a virtual environment and install dependencies**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Copy the environment template and adjust values**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your secrets and database connection details. Settings are read via `python-decouple`, so nothing sensitive needs to live in source code.

4. **Configure PostgreSQL** (match the credentials in `.env`):
   ```bash
   # Create database role (skip if it already exists)
   createuser postgres --superuser --pwprompt

   # Create the application database
   createdb personal_chef_db -O postgres
   ```
   The default configuration expects:
   - database: `personal_chef_db`
   - user: `postgres`
   - password: `password`
   - host: `localhost`
   - port: `5432`

   Adjust these values in `.env` (and in PostgreSQL) if you prefer a different setup. Boto3 will automatically pick up AWS credentials from environment variables or your local AWS profile. If you do not supply FairPrice credentials, the code falls back to mock grocery data.

5. **Apply migrations**
   ```bash
   python manage.py makemigrations users api
   python manage.py migrate
   ```

6. **Create an admin user (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```
   The API listens on `http://127.0.0.1:8000/` by default.

## Key Management Commands

- `python manage.py shell` – ad-hoc inspection or data fixes using Django ORM
- `python manage.py test` – run test suite (no tests are included yet, but this hooks into Django’s runner)
- `python manage.py collectstatic` – gather static assets for deployment (only needed in production)

## API Quick Reference

All endpoints below are namespaced under `http://127.0.0.1:8000/api/v1/`. JWT authentication is required for every route except registration and login. Supply the access token in the `Authorization: Bearer <token>` header.

### Authentication & Profile (`users` app)

- `POST auth/register/` – register a new account. Creates `User` + `UserProfile` and returns tokens.
- `POST auth/login/` – obtain fresh access and refresh tokens.
- `GET auth/profile/` – retrieve the authenticated user’s profile.
- `PUT auth/profile/update/` – partially update profile details (preferences, allergies, goals, height, weight).

### Recipes (`api.views.recipe_views`)

- `POST recipes/generate/` – forward a natural language prompt plus the caller’s profile to AWS Bedrock to generate a structured recipe payload.
- `GET recipes/pantry-suggestions/` – use pantry contents (`UserGroceryList`) to request recipe ideas from Bedrock.
- `GET recipes/saved-recipes/` – list the caller’s saved recipes.
- `POST recipes/saved-recipes/` – persist a recipe payload locally and associate it with the current user.
- `DELETE recipes/saved-recipes/<recipe_id>/` – remove a saved recipe association.

### Groceries (`api.views.grocery_views`)

- `GET groceries/search/?query=<term>` – proxy to the FairPrice API (or mock data) for ingredient search results.
- `GET groceries/list/` – list the caller’s stored grocery/pantry items.
- `POST groceries/list/` – add a new grocery item. Body should include `ingredient_name`, `quantity`, and optional `price`/`macros`.
- `DELETE groceries/list/<item_id>/` – remove a grocery item from the list.

## External Integrations

- **AWS Bedrock**: Implemented in `api/services/aws_bedrock.py`. Replace the `modelId` with the Bedrock model you have access to, and ensure AWS credentials/region are configured in your environment. Without valid credentials the AI endpoints will raise an exception.
- **FairPrice API**: Implemented in `api/services/fairprice_api.py`. Provide a real `FAIRPRICE_API_KEY` to hit the live API; otherwise, the service returns mock data to keep local development flowing.

## Troubleshooting Tips

- If migrations fail with `psycopg2.OperationalError`, confirm PostgreSQL is running and that the credentials in `.env` match your local database user and password.
- On macOS and Linux you might need developer headers for PostgreSQL (`postgresql-devel`, `libpq-dev` or similar) before installing `psycopg2-binary`.
- If Bedrock calls return permission errors, verify your AWS user or role has the necessary Bedrock access policies.
- Make sure to run `python manage.py makemigrations` the first time you pull new models; this repository does not ship pre-generated migration files.

## Project Structure (Backend)

```
backend/
├── api/                      # Recipes, groceries, services, serializers, views
├── personal_chef_project/    # Django project config (settings, URLs, WSGI)
├── users/                    # Custom user model, profiles, auth views
├── manage.py
├── requirements.txt
├── .env.example              # Environment variable template
└── .env                      # Local environment settings (not for production commits)
```

## Next Steps

- Add automated tests around the recipe and grocery flows to lock in behaviours.
- Introduce environment-based settings profiles (e.g., separate production/staging modules) if deploying beyond local dev.
- Consider adopting Django REST Framework viewsets or routers if the API grows, to reduce manual URL wiring.
