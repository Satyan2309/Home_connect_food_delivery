import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import PersonalInfoSection from './components/PersonalInfoSection';
import DeliveryAddressSection from './components/DeliveryAddressSection';
import PaymentMethodsSection from './components/PaymentMethodsSection';
import PreferencesSection from './components/PreferencesSection';
import AccountSettingsSection from './components/AccountSettingsSection';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const UserProfileSettings = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [userInfo, setUserInfo] = useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  });

  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'home',
      label: 'Home',
      street: '123 Oak Street',
      apartment: 'Apt 2B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      instructions: 'Ring doorbell twice',
      isPrimary: true
    },
    {
      id: '2',
      type: 'work',
      label: 'Office',
      street: '456 Market Street',
      apartment: 'Suite 1200',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      instructions: 'Leave with reception',
      isPrimary: false
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'credit',
      cardholderName: 'Sarah Johnson',
      lastFour: '4242',
      brand: 'visa',
      expiryMonth: '12',
      expiryYear: '2027',
      isDefault: true
    },
    {
      id: '2',
      type: 'debit',
      cardholderName: 'Sarah Johnson',
      lastFour: '8888',
      brand: 'mastercard',
      expiryMonth: '08',
      expiryYear: '2026',
      isDefault: false
    }
  ]);

  const [preferences, setPreferences] = useState({
    dietaryRestrictions: ['vegetarian', 'gluten-free'],
    cuisinePreferences: ['italian', 'indian', 'mediterranean'],
    notifications: {
      orderUpdates: true,
      promotions: false,
      newChefs: true,
      weeklyDigest: true
    },
    language: 'en',
    currency: 'USD'
  });

  const navigationItems = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: 'User',
      description: 'Manage your profile information'
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: 'MapPin',
      description: 'Manage delivery locations'
    },
    {
      id: 'payments',
      label: 'Payment Methods',
      icon: 'CreditCard',
      description: 'Manage cards and billing'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Settings',
      description: 'Dietary and app preferences'
    },
    {
      id: 'account',
      label: 'Account Settings',
      icon: 'Shield',
      description: 'Security and privacy settings'
    }
  ];

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    if (savedLanguage !== preferences.language) {
      setPreferences(prev => ({ ...prev, language: savedLanguage }));
    }
  }, []);

  const handleUpdateInfo = async (newInfo) => {
    try {
      // Import userService dynamically to avoid circular dependencies
      const { userService } = await import('../../utils');
      
      // Call the API to update user profile
      await userService.updateUserProfile({
        fullName: `${newInfo.firstName} ${newInfo.lastName}`,
        email: newInfo.email,
        phone: newInfo.phone,
        profileImage: newInfo.profileImage
      });
      
      // Update local state after successful API call
      setUserInfo(newInfo);
      console.log('User info updated successfully');
    } catch (error) {
      console.error('Failed to update user info:', error);
      // Could show an error message to the user here
    }
  };

  const handleUpdateAddresses = async (newAddresses) => {
    try {
      // Import userService dynamically to avoid circular dependencies
      const { userService } = await import('../../utils');
      
      // In a real implementation, we would need to:
      // 1. Compare old and new addresses to determine which ones to add, update, or delete
      // 2. Make appropriate API calls for each change
      
      // For now, we'll just update the local state and log the changes
      // This would be replaced with actual API calls in production
      
      // Example of how this might work with real API calls:
      // const oldAddressIds = addresses.map(addr => addr.id);
      // const newAddressIds = newAddresses.map(addr => addr.id);
      // 
      // // Handle additions and updates
      // for (const address of newAddresses) {
      //   if (!address.id || !oldAddressIds.includes(address.id)) {
      //     // New address - add it
      //     await userService.addAddress(address);
      //   } else {
      //     // Existing address - update it
      //     await userService.updateAddress(address.id, address);
      //   }
      // }
      // 
      // // Handle deletions
      // for (const oldId of oldAddressIds) {
      //   if (!newAddressIds.includes(oldId)) {
      //     // Address was removed - delete it
      //     await userService.deleteAddress(oldId);
      //   }
      // }
      
      // Update local state
      setAddresses(newAddresses);
      console.log('Addresses updated successfully');
    } catch (error) {
      console.error('Failed to update addresses:', error);
      // Could show an error message to the user here
    }
  };

  const handleUpdatePaymentMethods = async (newMethods) => {
    try {
      // Import userService dynamically to avoid circular dependencies
      const { userService } = await import('../../utils');
      
      // In a real implementation, this would call an API endpoint to update payment methods
      // For now, we'll just update the local state
      // This would be replaced with actual API calls in production
      
      // Note: Payment processing typically requires integration with a payment processor
      // like Stripe, PayPal, etc., and would involve more complex logic
      
      // Update local state
      setPaymentMethods(newMethods);
      console.log('Payment methods updated successfully');
    } catch (error) {
      console.error('Failed to update payment methods:', error);
      // Could show an error message to the user here
    }
  };

  const handleUpdatePreferences = async (newPreferences) => {
    try {
      // Import userService dynamically to avoid circular dependencies
      const { userService } = await import('../../utils');
      
      // Call the API to update user preferences
      await userService.updatePreferences(newPreferences);
      
      // Update local state after successful API call
      setPreferences(newPreferences);
      
      // Save language preference to localStorage for immediate use in the UI
      localStorage.setItem('language', newPreferences.language);
      
      console.log('Preferences updated successfully');
    } catch (error) {
      console.error('Failed to update preferences:', error);
      // Could show an error message to the user here
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      // Import userService dynamically to avoid circular dependencies
      const { userService } = await import('../../utils');
      
      // In a real implementation, this would call an API endpoint to update account settings
      // For now, we'll just log the changes
      // This would be replaced with actual API calls in production
      
      // Note: Different types of settings might require different API endpoints
      // For example, password changes would use userService.updatePassword
      
      console.log('Account settings updated successfully:', newSettings);
    } catch (error) {
      console.error('Failed to update account settings:', error);
      // Could show an error message to the user here
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <PersonalInfoSection
            userInfo={userInfo}
            onUpdateInfo={handleUpdateInfo}
          />
        );
      case 'addresses':
        return (
          <DeliveryAddressSection
            addresses={addresses}
            onUpdateAddresses={handleUpdateAddresses}
          />
        );
      case 'payments':
        return (
          <PaymentMethodsSection
            paymentMethods={paymentMethods}
            onUpdatePaymentMethods={handleUpdatePaymentMethods}
          />
        );
      case 'preferences':
        return (
          <PreferencesSection
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
          />
        );
      case 'account':
        return (
          <AccountSettingsSection
            onUpdateSettings={handleUpdateSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Profile & Settings - HomeCook Connect</title>
        <meta name="description" content="Manage your profile, delivery addresses, payment methods, and account preferences on HomeCook Connect." />
      </Helmet>

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information, preferences, and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4 shadow-warm-sm sticky top-24">
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-start space-x-3 p-3 rounded-lg text-left transition-colors ${
                      activeSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon 
                      name={item.icon} 
                      size={18} 
                      className={`mt-0.5 ${
                        activeSection === item.id ? 'text-primary-foreground' : ''
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${
                        activeSection === item.id ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                        {item.label}
                      </div>
                      <div className={`text-xs mt-1 ${
                        activeSection === item.id 
                          ? 'text-primary-foreground/80' 
                          : 'text-muted-foreground'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>

              {/* User Summary */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    {userInfo.profileImage ? (
                      <Image
                        src={userInfo.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="User" size={20} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">
                      {userInfo.firstName} {userInfo.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {userInfo.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderActiveSection()}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg min-w-0 flex-shrink-0 transition-colors ${
                activeSection === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item.icon} size={16} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default UserProfileSettings;