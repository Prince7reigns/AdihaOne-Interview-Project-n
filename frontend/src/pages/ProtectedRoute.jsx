import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../api/auth';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      try {
        const res = await authService.healthcheck({ token });
        if (res.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace with a spinner
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
