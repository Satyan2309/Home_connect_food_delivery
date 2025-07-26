import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../utils/authService';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = authService.isAuthenticated();
      setIsAuthenticated(authStatus);
      
      if (authStatus) {
        setUserRole(authService.getUserRole());
        setUserEmail(localStorage.getItem('userEmail'));
        setUserName(localStorage.getItem('userName'));
      } else {
        setUserRole(null);
        setUserEmail(null);
        setUserName(null);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Listen for storage events (for multi-tab support)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for auth changes within the same tab
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const userData = await authService.login(credentials);
      setIsAuthenticated(true);
      setUserRole(userData.userType);
      setUserEmail(userData.email);
      setUserName(userData.fullName);
      
      // Dispatch event for other components to know auth changed
      window.dispatchEvent(new Event('authChange'));
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const newUser = await authService.register(userData);
      setIsAuthenticated(true);
      setUserRole(newUser.userType);
      setUserEmail(newUser.email);
      setUserName(newUser.fullName);
      
      // Dispatch event for other components to know auth changed
      window.dispatchEvent(new Event('authChange'));
      
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
    setUserName(null);
    
    // Dispatch event for other components to know auth changed
    window.dispatchEvent(new Event('authChange'));
  };

  // Switch user role (for demo purposes)
  const switchRole = () => {
    const newRole = userRole === 'customer' ? 'chef' : 'customer';
    localStorage.setItem('userRole', newRole);
    setUserRole(newRole);
    
    // Dispatch event for other components to know auth changed
    window.dispatchEvent(new Event('authChange'));
  };

  // Context value
  const value = {
    isAuthenticated,
    userRole,
    userEmail,
    userName,
    isLoading,
    login,
    register,
    logout,
    switchRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;