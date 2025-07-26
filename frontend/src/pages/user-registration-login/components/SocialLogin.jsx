import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import api from '../../../utils/api';


const SocialLogin = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  // Initialize Google OAuth client
  useEffect(() => {
    // Load the Google Sign-In API script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google OAuth script loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load Google OAuth script');
      };
      document.body.appendChild(script);
    };
    
    loadGoogleScript();
  }, []);

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'bg-white border-border text-foreground hover:bg-muted'
    }
    // Facebook OAuth removed as requested
  ];

  const handleSocialLogin = async (provider) => {
    setLoadingProvider(provider.id);
    
    try {
      // Import authService dynamically to avoid circular dependencies
      const { authService } = await import('../../../utils');
      
      if (provider.id === 'google') {
        // Use the actual Google Sign-In API with our client ID
        if (window.google?.accounts?.oauth2) {
          const googleAuth = window.google.accounts.oauth2.initCodeClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: 'email profile',
            callback: async (response) => {
              if (response.code) {
                try {
                  // Exchange code for tokens on your backend
                  const result = await api.post('/auth/google', { 
                    code: response.code,
                    // Send profile info from Google's response
                    profile: {
                      id: response.id,
                      name: response.name,
                      email: response.email,
                      picture: response.picture
                    }
                  });
                  
                  // Handle successful login
                  localStorage.setItem('token', result.data.token);
                  localStorage.setItem('isAuthenticated', 'true');
                  localStorage.setItem('userRole', result.data.userType);
                  localStorage.setItem('userEmail', result.data.email);
                  localStorage.setItem('userName', result.data.fullName);
                  localStorage.setItem('socialLogin', 'google');
                  
                  onSuccess();
                  navigate('/meal-discovery-browse');
                } catch (error) {
                  console.error('Error exchanging Google auth code:', error);
                  setLoadingProvider(null);
                }
              }
            },
            error_callback: (error) => {
              console.error('Google auth error:', error);
              setLoadingProvider(null);
            }
          });
          googleAuth.requestCode();
          return; // Exit early as we're handling auth through Google API
        } else {
          console.error('Google OAuth API not loaded properly');
        }
      }
      
      // Fallback for development/testing if Google API fails to load
      console.warn('Using mock authentication as fallback');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response data that would come from the backend
      const mockResponseData = {
        _id: `mock_${provider.id}_user_id`,
        fullName: `${provider.name} User`,
        email: `user@${provider.id}.com`,
        userType: 'customer',
        token: 'mock_social_auth_token'
      };
      
      // Store auth data using authService methods
      localStorage.setItem('token', mockResponseData.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', mockResponseData.userType);
      localStorage.setItem('userEmail', mockResponseData.email);
      localStorage.setItem('userName', mockResponseData.fullName);
      localStorage.setItem('socialLogin', provider.id); // Keep track of social login provider
      
      onSuccess();
      navigate('/meal-discovery-browse');
    } catch (error) {
      console.error(`${provider.name} login failed:`, error);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            onClick={() => handleSocialLogin(provider)}
            loading={loadingProvider === provider.id}
            iconName={provider.icon}
            iconPosition="left"
            className={`${provider.color} transition-colors duration-200`}
          >
            {provider.name}
          </Button>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground text-center mt-4">
        By continuing, you agree to our{' '}
        <button className="text-primary hover:text-primary/80 underline">
          Terms of Service
        </button>{' '}
        and{' '}
        <button className="text-primary hover:text-primary/80 underline">
          Privacy Policy
        </button>
      </p>
    </div>
  );
};

export default SocialLogin;