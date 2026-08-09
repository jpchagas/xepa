// React
import { useEffect, useState } from 'react'

export default function useSplashScreen(duration = 2000) {
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFinished(true)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  return finished
}