// Routing
import { Navigate } from 'react-router-dom'

function PublicRoute({ user, children }) {
  if (user) {
    return <Navigate to="/main" replace />
  }

  return children
}

export default PublicRoute