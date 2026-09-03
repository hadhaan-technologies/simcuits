import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const { auth, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/login" replace />;
  }

  return typeof children === 'function' ? children(auth) : children;
}
