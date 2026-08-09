// Routing
import { useLocation } from 'react-router-dom'

// Components
import SplashScreen from './components/feedback/SplashScreen'
import IOSInstallBanner from './components/feedback/IOSInstallBanner'

// Hooks
import useAuth from './hooks/useAuth'
import useSplashScreen from './hooks/useSplashScreen'

// Routes
import AppRoutes from './routes/AppRoutes'

function App() {
  const location = useLocation()

  const { user, loading: authLoading } = useAuth()
  const splashFinished = useSplashScreen()

  const isAppLoading = authLoading || !splashFinished

  if (isAppLoading) {
    return <SplashScreen />
  }

  return (
    <>
      <IOSInstallBanner />

      <AppRoutes
        user={user}
        location={location}
      />
    </>
  )
}

export default App