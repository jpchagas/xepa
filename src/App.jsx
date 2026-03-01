// App.jsx
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

import SplashScreen from './SplashScreen.jsx'
import Login from './Login.jsx'
import MainScreen from './MainScreen.jsx'
import Register from './Register'
import ForgotPassword from './ForgotPassword'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
    <Routes>
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
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/main" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}

export default App