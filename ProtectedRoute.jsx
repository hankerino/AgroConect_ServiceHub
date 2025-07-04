// ProtectedRoute.jsx
import { useAuth } from './AuthProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session === null) {
      navigate('/login'); // redirect to login if not authenticated
    }
  }, [session]);

  return session ? children : null;
};

export default ProtectedRoute;
