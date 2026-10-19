// React
import { useCallback, useState } from 'react'


// Snackbar state for the main screen.
// `action` is an optional { label, onClick } (e.g. "Desfazer").
function useAlert() {
  const [alert, setAlert] = useState({
    id: 0,
    open: false,
    severity: 'success',
    message: '',
    action: null
  })

  const showAlert = useCallback(
    (severity, message, action = null) => {
      setAlert(prev => ({
        id: prev.id + 1,
        open: true,
        severity,
        message,
        action
      }))
    },
    []
  )

  const closeAlert = useCallback(() => {
    setAlert(prev => ({
      ...prev,
      open: false
    }))
  }, [])

  return {
    alert,
    showAlert,
    closeAlert
  }
}

export default useAlert
