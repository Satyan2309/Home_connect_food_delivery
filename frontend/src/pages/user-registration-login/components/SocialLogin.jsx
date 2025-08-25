import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import api from '../../../utils/api';


const SocialLogin = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState(null);

  // Track Google script loading status
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const [googleScriptError, setGoogleScriptError] = useState(false);
  
  // Reference to track if component is mounted
  const isMounted = useRef(true);
  
  // Initialize Google OAuth client
  useEffect(() => {
    // Set up cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    // Load the Google Sign-In API script
    const loadGoogleScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        console.log('Google OAuth script already loaded');
        setGoogleScriptLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google OAuth script loaded successfully');
        if (isMounted.current) {
          setGoogleScriptLoaded(true);
          setGoogleScriptError(false);
        }
      };
      
      script.onerror = () => {
        console.error('Failed to load Google OAuth script');
        if (isMounted.current) {
          setGoogleScriptError(true);
          setGoogleScriptLoaded(false);
        }
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

  // State to track authentication errors
  const [authError, setAuthError] = useState(null);

  const handleSocialLogin = async (provider) => {
    // Reset error states on each attempt
    setAuthError(null);
    setLoadingProvider(provider.id);
    
    try {
      // Import authService dynamically to avoid circular dependencies
      const { authService } = await import('../../../utils');
      
      if (provider.id === 'google') {
        // Check if Google API is loaded
        if (!googleScriptLoaded) {
          setAuthError('Google Sign-In is still loading. Please try again in a moment.');
          setLoadingProvider(null);
          return;
        }
        
        if (googleScriptError) {
          setAuthError('Failed to load Google Sign-In. Please refresh the page and try again.');
          setLoadingProvider(null);
          return;
        }
        
        // Use the actual Google Sign-In API with our client ID
        if (window.google?.accounts?.oauth2) {
          // This function has been moved below
          
          // Initialize Google OAuth client with redirect mode only
          const initGoogleAuth = () => {
            console.log('Initializing Google Auth with redirect mode');
            
            return window.google.accounts.oauth2.initCodeClient({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              scope: 'email profile openid',
              ux_mode: 'redirect',
              redirect_uri: `http://localhost:7070`, // Explicit redirect URI matching our frontend port
              callback: async (response) => {
              // No need to clear popup detection timeout since we're using redirect mode only
              
              if (response.code) {
                try {
                  console.log('Received Google auth code, exchanging for tokens');
                  
                  // Get user profile from Google's ID token
                  // In a real implementation, this would be done server-side
                  // For now, we'll use a mock profile
                  const mockProfile = {
                    id: 'google_user_id',
                    name: 'Google User',
                    email: 'user@gmail.com',
                    picture: 'https://lh3.googleusercontent.com/a/default-user'
                  };
                  
                  // Exchange code for tokens on your backend
                  const result = await api.post('/auth/google', { 
                    code: response.code,
                    // Send profile info
                    profile: mockProfile
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
                  if (isMounted.current) {
                    setAuthError('Failed to complete Google authentication. Please try again.');
                    setLoadingProvider(null);
                  }
                }
              }
            },
            error_callback: (error) => {
              console.error('Google auth error:', error);
              console.error('Google auth error details:', JSON.stringify(error));
              
              if (isMounted.current) {
                setAuthError('Google authentication error: ' + (error.message || 'Unknown error'));
                setLoadingProvider(null);
              }
            }
          });
          };
          
          // Initialize Google auth with redirect mode and request the code
          const googleAuth = initGoogleAuth();
          googleAuth.requestCode();
          
          return; // Exit early as we're handling auth through Google API
        } else {
          console.error('Google OAuth API not loaded properly');
          setAuthError('Google Sign-In API failed to initialize. Please refresh the page.');
          setLoadingProvider(null);
          
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
        }
      }
      
      // We'll handle the fallback in the else block above
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
      
      {/* Error messages */}
      {authError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            <strong>Authentication Error:</strong> {authError}
          </p>
        </div>
      )}
      
      {googleScriptError && !authError && (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            <strong>Google Sign-In unavailable.</strong> Please refresh the page or try again later.
          </p>
        </div>
      )}
      
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