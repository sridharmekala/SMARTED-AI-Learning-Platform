import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdmin, isAuthenticated } from '../services/authService';

function AdminRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated('admin')) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin('admin')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
