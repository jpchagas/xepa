// App.jsx
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { AnimatePresence } from 'framer-motion'

import SplashScreen from './SplashScreen.jsx'
import Login from './Login.jsx'
import MainScreen from './MainScreen.jsx'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import PrivacyPolicy from "./pages/PrivacyPolicy"
import Contact from "./pages/Contact"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const location = useLocation()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  if (loading) {
    return <SplashScreen />
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        <Route
          path="/"
          element={<Navigate to={user ? '/main' : '/login'} />}
        />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/main" />}
        />

        <Route
          path="/main"
          element={user ? <MainScreen /> : <Navigate to="/login" />}
        />

        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/main" />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

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

export default App