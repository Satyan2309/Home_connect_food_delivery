import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../utils/authService';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return (
      <Navigate 
        to="/user-registration-login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;