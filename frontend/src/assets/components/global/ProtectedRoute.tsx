import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode; // This allows the route to accept any children components
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, authChecked } = useAuth();

  if (!authChecked) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}

export default ProtectedRoute;