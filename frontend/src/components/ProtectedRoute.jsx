import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin, isAuthenticated } from '../services/authService';

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated('student')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin('student')) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
