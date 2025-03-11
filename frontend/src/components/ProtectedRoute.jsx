import { Navigate } from 'react-router-dom';
import useComponentLogger from '../hooks/useComponentLogger';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  useComponentLogger('ProtectedRoute');
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
