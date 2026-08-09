We are continuing a refactoring session for my React/Vite/Firebase application called Xepa.

Project structure (current):
- React + Vite
- Material UI
- React Router
- Firebase Auth + Firestore
- Framer Motion
- Feature-based folder organization

Current goal:
Improve maintainability by separating UI components from business logic, extracting reusable components, and organizing hooks/services without changing application behavior.

Important decisions already made:

1. main.jsx
- Already reviewed and considered good.
- Current structure:
  - StrictMode
  - ThemeProvider
  - CssBaseline
  - BrowserRouter
  - App
- No further refactor needed yet.

2. App.jsx
We refactored the direction:
- App should only compose the application.
- Firebase auth logic moved into a hook.
- Splash timing moved into a hook.

Created:
src/hooks/useAuth.js
- Handles Firebase onAuthStateChanged.
- Returns:
  {
    user,
    loading
  }

Created:
src/hooks/useSplashScreen.js
- Handles splash timing.
- Returns boolean indicating when splash is finished.

App.jsx now uses:
- useAuth()
- useSplashScreen()

and renders SplashScreen while:
authLoading || !splashFinished

3. AppRoutes.jsx
We decided to improve routing by extracting route guards.

Created:
src/routes/PublicRoute.jsx
- Redirects authenticated users to /main.

Created:
src/routes/PrivateRoute.jsx
- Redirects unauthenticated users to /login.

AppRoutes.jsx should use these guards instead of repeating:
user ? component : Navigate

4. SplashScreen.jsx
Decision:
Keep it simple and presentational.

Remove:
- useState
- useEffect
- internal timer

Reason:
App should own splash lifecycle.
SplashScreen should only render UI.

Future possibility:
Use Framer Motion AnimatePresence for a proper exit animation, but don't add timers.

5. Authentication feature refactor

Current direction:

Before:
Login/Register/ForgotPassword contained:
- Firebase logic
- state
- UI
- navigation

New structure:

src/features/auth/

AuthLayout.jsx
- Shared full-page layout:
  - minHeight
  - centering
  - background

AuthCard.jsx
- Shared card styling:
  - Paper
  - logo
  - shadow
  - spacing

LoginForm.jsx
RegisterForm.jsx
ForgotPasswordForm.jsx
- Only form UI

Login.jsx
Register.jsx
ForgotPassword.jsx
- Page composition/navigation only

6. Authentication hooks created:

src/hooks/

useLogin.js
- Handles:
  - signInWithEmailAndPassword
  - email/password state
  - loading
  - error

useRegister.js
- Handles:
  - createUserWithEmailAndPassword
  - Firestore user document creation
  - loading
  - error

useForgotPassword.js
- Handles:
  - sendPasswordResetEmail
  - success/error messages

7. Firebase service

Current file:
src/services/firebase.js

Reviewed and direction:
- Keep Firebase initialization here.
- Export:
  auth
  db
  default app

Expected:

import { auth, db } from '../../services/firebase'

Do not import './firebase' from auth feature files.

8. Current authentication architecture:

src/
├── features/
│   └── auth/
│       ├── AuthCard.jsx
│       ├── AuthLayout.jsx
│       ├── Login.jsx
│       ├── LoginForm.jsx
│       ├── Register.jsx
│       ├── RegisterForm.jsx
│       ├── ForgotPassword.jsx
│       └── ForgotPasswordForm.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useSplashScreen.js
│   ├── useLogin.js
│   ├── useRegister.js
│   └── useForgotPassword.js
│
├── services/
│   └── firebase.js

9. Coding style preference:
Continue using grouped imports:

// React

// Third-party

// Firebase

// Components

// Hooks

// Services

// Utils

Keep components readable and avoid unnecessary abstraction.

10. Next planned work:
Continue reviewing the remaining application files one by one.

Most likely next:
- MainScreen.jsx
- Shopping feature components:
  - ShoppingList.jsx
  - ShoppingListItem.jsx
  - AddItemModal.jsx
  - ListControls.jsx
  - ListSelector.jsx

Focus especially on:
- separating Firestore/business logic into hooks
- reducing large components
- extracting reusable UI
- keeping behavior unchanged

When we continue, first ask me for the next file if I haven't provided one yet.