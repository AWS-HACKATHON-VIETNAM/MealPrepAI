
  # Dishly Frontend 🍽️

A mobile-first React application for AI-powered meal planning, recipe generation, and grocery list management. This frontend integrates with the Dishly Django REST API backend.

The original design is available at https://www.figma.com/design/TC2TjhdEgcwXCWxDsOoZVz/Mobile-Meal-Planning-App.

## ✨ Features

- 🔐 **Authentication**: User registration, login with JWT token management (access + refresh tokens)
- 🍳 **Recipe Management**: 
  - AI-generated recipes based on user prompts
  - Save and manage favorite recipes
  - View detailed recipe information (ingredients, steps, macros, difficulty)
  - Delete saved recipes
- 🛒 **Grocery Lists**: 
  - Single unified grocery list (no multiple lists)
  - Add, edit, and delete grocery items
  - Track ingredient and quantity for each item
  - Track purchase status with checkboxes
  - Automatic "Add to Pantry" prompt when checking items
- 🥫 **Pantry Management**: 
  - Full CRUD operations for pantry items
  - Track item names and optional notes
  - View all pantry items in organized cards
  - Automatically add items from grocery list when checking them off
  - Accessible via bottom navigation and Profile screen
- 👤 **User Profile**: 
  - View and update dietary preferences
  - Manage allergies
  - Track body metrics (weight, height, BMI)
  - Set fitness goals
- 📱 **Mobile-First Design**: Responsive UI optimized for mobile devices with intuitive navigation

## 🛠️ Tech Stack

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for modern styling
- **Radix UI** for accessible component primitives
- **Lucide React** for beautiful icons
- **Native Fetch API** for HTTP requests (no external libraries)
- **Custom JWT Authentication** with auto-refresh capability

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Dishly Django backend** running at `http://127.0.0.1:8000`
- Modern web browser with localStorage support

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

> **Note**: Update the URL if your backend runs on a different host/port.

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Open in Browser

Navigate to `http://localhost:5173` and you'll see the login screen. Register a new account or log in with existing credentials.

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── ui/                 # Reusable UI components (buttons, inputs, etc.)
│   ├── figma/              # Figma-exported components
│   ├── LoginScreen.tsx     # ✅ Integrated - Authentication UI
│   ├── HomeScreen.tsx      # AI chat for recipe generation
│   ├── RecipeListScreen.tsx # ✅ Integrated - Display saved recipes
│   ├── RecipeDetailScreen.tsx # ✅ Integrated - Recipe details with save
│   ├── SavedRecipesScreen.tsx # ✅ Integrated - Manage saved recipes
│   ├── GroceryListScreen.tsx # ✅ Integrated - Single grocery list with add-to-pantry
│   ├── PantryScreen.tsx    # ✅ Integrated - Pantry inventory management
│   ├── ProfileScreen.tsx   # ✅ Integrated - User profile display
│   └── CookingModeScreen.tsx # Step-by-step cooking mode
├── contexts/               # React context providers
│   └── AuthContext.tsx    # ✅ Global authentication state management
├── services/              # API service modules
│   ├── recipe.service.ts  # ✅ Recipe API calls (generate, save, list, delete)
│   ├── grocery.service.ts # ✅ Grocery list & item CRUD operations
│   └── pantry.service.ts  # ✅ Pantry item management
├── lib/                   # Core utilities
│   └── apiClient.ts       # ✅ HTTP client with JWT auto-refresh
├── config/                # Configuration files
│   └── api.config.ts      # ✅ API endpoint definitions
├── types/                 # TypeScript type definitions
│   └── api.types.ts       # ✅ Backend API interfaces (matches Django models)
├── styles/                # Global styles
│   └── globals.css        # Tailwind CSS imports
├── App.tsx                # ✅ Main app with routing & auth logic
└── main.tsx               # ✅ Entry point with AuthProvider
```

**Legend**: ✅ = Fully integrated with Dishly backend

## 🔌 Backend Integration

### Architecture Overview

The frontend uses a **custom HTTP client** built on native Fetch API with the following features:

- **JWT Token Management**: Automatic injection of `Bearer` tokens in headers
- **Auto Token Refresh**: Detects 401 errors and refreshes access token using refresh token
- **localStorage Persistence**: Tokens persist across browser sessions
- **TypeScript Safety**: Strongly typed request/response interfaces
- **Error Handling**: Centralized error parsing and user-friendly messages

### Authentication Flow

1. **User Registration/Login** → `LoginScreen` component
2. **JWT Tokens Received** → Access token (short-lived) + Refresh token (long-lived)
3. **Tokens Stored** → `localStorage` via `apiClient.setTokens()`
4. **Profile Loaded** → Separate API call to `/auth/profile/`
5. **AuthContext Updates** → Global authentication state
6. **Authenticated Navigation** → App redirects to HomeScreen

### Token Refresh Mechanism

```typescript
// apiClient automatically handles token refresh
1. Request fails with 401 Unauthorized
2. apiClient calls /auth/token/refresh/ with refresh token
3. New access token received and stored
4. Original request retried with new token
5. If refresh fails → User logged out automatically
```

### API Endpoints

All endpoints use the base URL from `.env`: `VITE_API_BASE_URL`

#### Authentication (`/auth/`)
- `POST /auth/register/` - Register new user
  - Body: `{ email, password, password_confirm, first_name, last_name }`
  - Returns: `{ access, refresh }`
- `POST /auth/login/` - Login existing user
  - Body: `{ email, password }`
  - Returns: `{ access, refresh }`
- `POST /auth/token/refresh/` - Refresh access token
  - Body: `{ refresh }`
  - Returns: `{ access }`
- `GET /auth/profile/` - Get user profile (requires auth)
  - Returns: `UserProfile` object
- `PUT /auth/profile/update/` - Update profile
  - Body: Partial `UserProfile` fields
  - Returns: Updated `UserProfile`

#### Recipes (`/recipes/`)
- `POST /recipes/generate/` - Generate AI recipe
  - Body: `{ prompt: string }`
  - Returns: `RecipeGenerateResponse`
- `GET /recipes/pantry-suggestions/` - Get recipe suggestions based on pantry
  - Returns: `Recipe[]`
- `GET /recipes/saved-recipes/` - List all saved recipes
  - Returns: `Recipe[]`
- `POST /recipes/save-recipes/` - Save a generated recipe
  - Body: `RecipeGenerateResponse` object
  - Returns: `{ message: string }`
- `DELETE /recipes/saved-recipes/<id>/` - Delete saved recipe
  - Returns: 204 No Content

#### Grocery Lists (`/grocery/`)
- `GET /grocery/grocery-list/` - List all grocery lists
  - Returns: `GroceryList[]`
- `POST /grocery/grocery-list/` - Create new list
  - Body: `{ name: string }`
  - Returns: `GroceryList`
- `GET /grocery/grocery-list/<id>/` - Get list with items
  - Returns: `GroceryList` (includes `items[]`)
- `PUT /grocery/grocery-list/<id>/` - Update list name
  - Body: `{ name: string }`
  - Returns: `GroceryList`
- `DELETE /grocery/grocery-list/<id>/` - Delete list
  - Returns: 204 No Content
- `GET /grocery/grocery-item/` - List items (optional `?grocery_list=<id>`)
  - Returns: `GroceryItem[]`
- `GET /grocery/grocery-item/<id>/` - Get single item (for editing)
  - Returns: `GroceryItem`
- `POST /grocery/grocery-item/` - Add item to list
  - Body: `GroceryItemCreateRequest`
  - Returns: `GroceryItem`
- `PUT /grocery/grocery-item/<id>/` - Update item
  - Body: Partial `GroceryItem` fields (ingredient, quantity, price, macros)
  - Returns: `GroceryItem`
- `DELETE /grocery/grocery-item/<id>/` - Delete item
  - Returns: 204 No Content
- `GET /grocery/search?q=<query>` - Search external grocery API
  - Returns: Search results

#### Pantry (`/pantry/`)
- `GET /pantry/items/` - List all pantry items for current user
  - Returns: `PantryItem[]`
- `POST /pantry/items/` - Add pantry item
  - Body: `{ name: string, notes?: string }`
  - Returns: `PantryItem`
- `GET /pantry/items/<id>/` - Get single pantry item
  - Returns: `PantryItem`
- `PUT /pantry/items/<id>/` - Update pantry item
  - Body: Partial `PantryItem` fields (name, notes)
  - Returns: `PantryItem`
- `DELETE /pantry/items/<id>/` - Delete pantry item
  - Returns: 204 No Content

### Pantry Integration Features

The Pantry functionality is fully integrated with:

**✅ Complete CRUD Operations:**
- View all pantry items in organized cards
- Add new items with name (required) and notes (optional)
- Edit existing items with pre-filled forms
- Delete items with confirmation
- Real-time updates and error handling

**✅ Grocery-to-Pantry Workflow:**
- When checking off grocery items (marking as purchased), a modal automatically appears
- Pre-fills item name (from ingredient) and notes (from quantity)
- Users can edit details or skip adding to pantry
- Streamlines the workflow from shopping to stocking pantry

**✅ Navigation Access:**
- Accessible via bottom navigation bar (Pantry tab with Package icon)
- Also accessible from Profile screen via "My Pantry" button
- Consistent mobile-first design matching other screens

**✅ UI/UX Design:**
- Custom modals with absolute positioning (no Radix Dialog positioning issues)
- Empty state guidance when no items exist
- Loading states with spinners
- Error handling with user-friendly messages
- Same design language as Grocery and Recipe screens (orange-500 theme)

**Type Definition:**
```typescript
interface PantryItem {
  id: number;
  name: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}
```

### Service Modules Architecture

#### `apiClient.ts` - Core HTTP Client
- Singleton class wrapping Fetch API
- Methods: `get()`, `post()`, `put()`, `patch()`, `delete()`
- Automatic JWT injection and refresh logic
- Centralized error handling
- No external dependencies (pure Fetch API)

#### `recipe.service.ts` - Recipe Operations
```typescript
recipeService.generateRecipe(request)      // Generate AI recipe
recipeService.getPantrySuggestions()       // Get suggestions from pantry
recipeService.getSavedRecipes()            // List saved recipes
recipeService.saveRecipe(recipe)           // Save recipe to collection
recipeService.deleteSavedRecipe(id)        // Remove saved recipe
```

#### `grocery.service.ts` - Grocery List Operations
```typescript
groceryService.getGroceryLists()           // List all lists
groceryService.getGroceryList(id)          // Get list with items
groceryService.createGroceryList(name)     // Create new list
groceryService.updateGroceryList(id, name) // Update list name
groceryService.deleteGroceryList(id)       // Delete list
groceryService.getGroceryItems(listId?)    // Get all items (optionally filtered by list)
groceryService.addGroceryItem(item)        // Add item to list
groceryService.updateGroceryItem(id, data) // Update item (ingredient, quantity, etc.)
groceryService.deleteGroceryItem(id)       // Delete item
groceryService.searchGroceryItem(query)    // Search external API
```

#### `pantry.service.ts` - Pantry Operations
```typescript
pantryService.getPantryItems()             // List all pantry items
pantryService.getPantryItem(id)            // Get single item (available, not actively used in UI)
pantryService.addPantryItem(item)          // Add pantry item
pantryService.updatePantryItem(id, data)   // Update item (name, notes)
pantryService.deletePantryItem(id)         // Delete item
```

### Type Safety

All API interactions are **fully typed** with TypeScript interfaces matching the Django backend models:

```typescript
// User & Profile
interface User { id, email, first_name, last_name }
interface UserProfile { 
  user, weight_kg, height_cm, gender, 
  preferences[], allergies[], goal 
}

// Recipes
interface Recipe {
  id, name, time_taken_minutes, difficulty,
  calories, macros, ingredients[], steps[], image_url
}

// Grocery
interface GroceryList { id, name, user_id, created_at, items[] }
interface GroceryItem { 
  id, grocery_list_id, ingredient, quantity, 
  price?, macros?, created_at 
}

// Pantry
interface PantryItem { 
  id, name, notes?, created_at, updated_at? 
}
interface PantryItemCreateRequest { 
  name, notes? 
}
```

## 💻 Development

### Running with Backend

**Terminal 1 - Django Backend:**
```bash
cd backend
python manage.py runserver
# Backend runs on http://127.0.0.1:8000
```

**Terminal 2 - React Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

**Terminal 3 (Optional) - TypeScript Check:**
```bash
npx tsc --noEmit --watch
# Real-time type checking
```

### CORS Configuration

Ensure Django backend allows the frontend origin in `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

### Available Scripts

```bash
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint (if configured)
npx tsc --noEmit     # TypeScript type check without emitting files
```

### Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 🐛 Troubleshooting

### API Requests Failing

**Problem**: Network errors or requests timing out

**Solutions**:
- ✅ Verify backend server is running: `http://127.0.0.1:8000`
- ✅ Check `.env` has correct `VITE_API_BASE_URL`
- ✅ Confirm CORS is properly configured in Django
- ✅ Open browser DevTools → Network tab to see failed requests
- ✅ Check Django terminal for error logs

### 401 Unauthorized Errors

**Problem**: Getting "Unauthorized" on authenticated endpoints

**Solutions**:
- ✅ Verify you're logged in (check localStorage for tokens)
- ✅ Try logging out and logging back in
- ✅ Check token expiration settings in Django
- ✅ Clear localStorage: `localStorage.clear()` in browser console
- ✅ Verify JWT_AUTH settings in Django `settings.py`

### TypeScript Errors

**Problem**: Type errors in development

**Solutions**:
- ✅ Run `npx tsc --noEmit` to see all type errors
- ✅ Ensure all dependencies are installed: `npm install`
- ✅ Check `tsconfig.json` is properly configured
- ✅ Restart TypeScript server in VS Code: `Cmd+Shift+P` → "Restart TS Server"

### CORS Errors

**Problem**: "CORS policy blocked" in browser console

**Solutions**:
- ✅ Add frontend URL to `CORS_ALLOWED_ORIGINS` in Django
- ✅ Install `django-cors-headers` in backend
- ✅ Add `'corsheaders.middleware.CorsMiddleware'` to Django middleware
- ✅ Restart Django server after changes

### Token Refresh Loops

**Problem**: Infinite refresh token requests

**Solutions**:
- ✅ Check refresh token hasn't expired
- ✅ Verify `/auth/token/refresh/` endpoint is working
- ✅ Clear localStorage and login again
- ✅ Check Django token expiration settings

### Build Errors

**Problem**: Production build fails

**Solutions**:
- ✅ Run development server first to catch errors
- ✅ Fix all TypeScript errors: `npx tsc --noEmit`
- ✅ Check for missing dependencies
- ✅ Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 🏗️ Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Output

```
dist/
├── index.html           # Entry HTML file
├── assets/
│   ├── index-[hash].js  # Bundled JavaScript
│   ├── index-[hash].css # Bundled CSS
│   └── [images]         # Optimized images
└── ...
```

### Deployment Options

**Option 1: Static File Server**
```bash
npx serve dist
```

**Option 2: Netlify**
```bash
# Build command: npm run build
# Publish directory: dist
```

**Option 3: Vercel**
```bash
vercel --prod
```

**Option 4: AWS S3 + CloudFront**
```bash
aws s3 sync dist/ s3://your-bucket-name
```

### Production Environment Variables

Update `.env.production`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

### Build Optimization

The Vite build automatically:
- ✅ Minifies JavaScript and CSS
- ✅ Tree-shakes unused code
- ✅ Optimizes images
- ✅ Generates source maps (for debugging)
- ✅ Code-splits for better loading performance

## 📱 Integrated Features

### ✅ Completed Integrations

| Screen | Status | Backend Integration |
|--------|--------|---------------------|
| LoginScreen | ✅ Complete | `/auth/register/`, `/auth/login/` |
| ProfileScreen | ✅ Complete | `/auth/profile/`, `/auth/profile/update/` |
| RecipeListScreen | ✅ Complete | `/recipes/saved-recipes/` (GET) |
| RecipeDetailScreen | ✅ Complete | `/recipes/save-recipes/` (POST) |
| SavedRecipesScreen | ✅ Complete | `/recipes/saved-recipes/` (GET, DELETE) |
| GroceryListScreen | ✅ Complete | `/grocery/*` (all CRUD + add-to-pantry) |
| PantryScreen | ✅ Complete | `/pantry/items/` (all CRUD operations) |
| AuthContext | ✅ Complete | JWT token management & auto-refresh |
| API Client | ✅ Complete | Custom Fetch wrapper with interceptors |
| Type Definitions | ✅ Complete | Full TypeScript coverage |

### 🚧 Pending Features

- [ ] HomeScreen AI chat integration with `/recipes/generate/`
- [ ] Recipe search and filtering
- [ ] Profile edit forms
- [ ] Image upload for recipes
- [ ] Meal history tracking
- [ ] Offline support with service workers
- [ ] Push notifications
- [ ] Social sharing features

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show error)
- [ ] Logout
- [ ] Token auto-refresh on expired access token

**Recipes:**
- [ ] View saved recipes list
- [ ] Click on recipe to see details
- [ ] Save recipe from detail screen
- [ ] Delete saved recipe
- [ ] Empty state when no recipes

**Grocery Lists:**
- [ ] Create new grocery list
- [ ] View list items
- [ ] Add items to list
- [ ] Edit items (ingredient, quantity)
- [ ] Delete items
- [ ] Toggle item checked state (mark as purchased)
- [ ] "Add to Pantry" modal when checking items
- [ ] Empty state handling

**Pantry:**
- [ ] View all pantry items
- [ ] Add new pantry item
- [ ] Edit pantry item (name, notes)
- [ ] Delete pantry item
- [ ] Add from grocery list when checking items
- [ ] Empty state handling

**Profile:**
- [ ] View profile data (weight, height, preferences, allergies)
- [ ] Calculate BMI correctly
- [ ] Logout button works

## 📚 Key Technologies Explained

### Why Fetch API Instead of Axios?

- **Native to browsers** - No external dependencies
- **Modern standard** - Fully supported in all modern browsers
- **Smaller bundle size** - Reduces JavaScript payload
- **Promise-based** - Easy async/await usage
- **Sufficient for needs** - All features we need (interceptors via wrapper)

### JWT Token Strategy

**Access Token** (short-lived, ~15 min):
- Used for API requests
- Stored in memory and localStorage
- Auto-refreshed when expired

**Refresh Token** (long-lived, ~7 days):
- Used to get new access tokens
- Only sent to `/auth/token/refresh/`
- Cleared on logout

**Security**:
- Tokens stored in httpOnly cookies would be more secure
- Consider implementing for production
- Current implementation suitable for development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

Part of the Dishly application suite developed for AWS Hackathon Vietnam.

## 👥 Team

**Organization**: AWS-HACKATHON-VIETNAM  
**Repository**: Frontend  
**Branch**: main

---

Made with ❤️ using React + TypeScript + Vite  