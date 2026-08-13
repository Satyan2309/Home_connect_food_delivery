import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoginForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock credentials for testing
  const mockCredentials = {
    customer: { email: 'customer@homecoook.com', password: 'customer123' },
    chef: { email: 'chef@homecook.com', password: 'chef123' }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Import authService dynamically to avoid circular dependencies
      const { authService } = await import('../../../utils');
      
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });
      
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      onSuccess();
      
      // Check if there's a redirect or returnUrl parameter in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect');
      const returnUrl = urlParams.get('returnUrl');
      
      if (returnUrl) {
        // Navigate to the return URL (used for chef profile access)
        navigate(returnUrl);
      } else if (redirectUrl) {
        // Navigate to the redirect URL
        navigate(redirectUrl);
      } else {
        // Navigate to the default page based on user role
        navigate(response.userType === 'customer' ? '/meal-discovery-browse' : '/chef-profile-menu-management');
      }
    } catch (error) {
      setErrors({ 
        general: error.toString().includes('Invalid credentials') 
          ? 'Invalid email or password. Please try again.' 
          : 'Login failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link would be sent to your email');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
          {errors.general}
        </div>
      )}
      
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
      />
      
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleInputChange}
        error={errors.password}
        required
      />
      
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleInputChange}
        />
        
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Forgot password?
        </button>
      </div>
      
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        className="mt-6"
      >
        Sign In
      </Button>
    </form>
  );
};


export default LoginForm;