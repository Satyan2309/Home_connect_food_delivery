import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialLogin from './components/SocialLogin';
import WelcomePanel from './components/WelcomePanel';
import Icon from '../../components/AppIcon';

const UserRegistrationLogin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      const userRole = localStorage.getItem('userRole') || 'customer';
      navigate(userRole === 'customer' ? '/meal-discovery-browse' : '/chef-profile-menu-management');
    }
  }, [navigate]);

  const handleAuthSuccess = () => {
    setIsLoading(true);
    // Success handling is done in individual form components
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Welcome Panel - Desktop Only */}
      <WelcomePanel activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name="ChefHat" size={24} color="white" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors">
                HomeCook Connect
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm">
              {activeTab === 'login' ?'Welcome back to your culinary journey' :'Join our community of food lovers'
              }
            </p>
          </div>

          {/* Auth Card */}
          <div className="bg-card rounded-2xl shadow-warm-lg p-6 sm:p-8 border border-border">
            {/* Tab Navigation */}
            <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Form Content */}
            <div className="space-y-6">
              {activeTab === 'login' ? (
                <LoginForm onSuccess={handleAuthSuccess} />
              ) : (
                <RegisterForm onSuccess={handleAuthSuccess} />
              )}

              {/* Social Login */}
              <SocialLogin onSuccess={handleAuthSuccess} />
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Need help?{' '}
              <button className="text-primary hover:text-primary/80 underline">
                Contact Support
              </button>
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
              <button className="hover:text-foreground transition-colors">
                Privacy Policy
              </button>
              <span>•</span>
              <button className="hover:text-foreground transition-colors">
                Terms of Service
              </button>
              <span>•</span>
              <button className="hover:text-foreground transition-colors">
                Help Center
              </button>
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card rounded-xl p-6 shadow-warm-lg flex items-center space-x-3">
                <Icon name="Loader" size={20} className="animate-spin text-primary" />
                <span className="text-foreground font-medium">Setting up your account...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationLogin;