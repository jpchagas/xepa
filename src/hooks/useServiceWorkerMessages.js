// React
import { useEffect } from 'react'

// Routing
import { useNavigate } from 'react-router-dom'


// Tapping a push notification while the app is open asks it to route
// in place (see public/push-sw.js) instead of reloading the page.
function useServiceWorkerMessages() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const handleMessage = event => {
      if (event.data?.type !== 'xepa:open') return

      const url = new URL(event.data.url, window.location.origin)

      navigate(`${url.pathname}${url.search}`)
    }

    navigator.serviceWorker.addEventListener('message', handleMessage)

    return () =>
      navigator.serviceWorker.removeEventListener('message', handleMessage)
  }, [navigate])
}

export default useServiceWorkerMessages
