// Third-party
import { AnimatePresence } from 'framer-motion'

// Routing
import { Navigate, Route, Routes } from 'react-router-dom'

// Route Guards
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'

// Auth
import Login from '../features/auth/Login'
import Register from '../features/auth/Register'
import ForgotPassword from '../features/auth/ForgotPassword'

// Pages
import MainScreen from '../pages/MainScreen'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import Contact from '../pages/Contact'

function AppRoutes({ user, location }) {
  return (
    <AnimatePresence mode="wait">
      <Routes
        location={location}
        key={location.pathname}
      >
        {/* Redirect */}

        <Route
          path="/"
          element={
            <Navigate
              to={user ? '/main' : '/login'}
              replace
            />
          }
        />

        {/* Public */}

        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute user={user}>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Private */}

        <Route
          path="/main"
          element={
            <PrivateRoute user={user}>
              <MainScreen />
            </PrivateRoute>
          }
        />

        {/* Static */}

        <Route
          path="/privacy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
      </Routes>
    </AnimatePresence>
  )
}

export default AppRoutes