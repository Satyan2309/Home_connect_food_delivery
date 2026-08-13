import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';

const PreferencesSection = ({ preferences, onUpdatePreferences }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    dietaryRestrictions: preferences.dietaryRestrictions || [],
    cuisinePreferences: preferences.cuisinePreferences || [],
    notifications: preferences.notifications || {
      orderUpdates: true,
      promotions: false,
      newChefs: true,
      weeklyDigest: false
    },
    language: preferences.language || 'en',
    currency: preferences.currency || 'INR'
  });

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
    { id: 'vegan', label: 'Vegan', description: 'No animal products' },
    { id: 'gluten-free', label: 'Gluten-Free', description: 'No gluten-containing ingredients' },
    { id: 'dairy-free', label: 'Dairy-Free', description: 'No dairy products' },
    { id: 'nut-free', label: 'Nut-Free', description: 'No nuts or nut products' },
    { id: 'keto', label: 'Keto', description: 'Low-carb, high-fat diet' },
    { id: 'paleo', label: 'Paleo', description: 'No processed foods' },
    { id: 'halal', label: 'Halal', description: 'Islamic dietary requirements' },
    { id: 'kosher', label: 'Kosher', description: 'Jewish dietary requirements' }
  ];

  const cuisineOptions = [
    { id: 'italian', label: 'Italian', icon: '🍝' },
    { id: 'chinese', label: 'Chinese', icon: '🥢' },
    { id: 'indian', label: 'Indian', icon: '🍛' },
    { id: 'mexican', label: 'Mexican', icon: '🌮' },
    { id: 'japanese', label: 'Japanese', icon: '🍣' },
    { id: 'thai', label: 'Thai', icon: '🍜' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
    { id: 'american', label: 'American', icon: '🍔' },
    { id: 'french', label: 'French', icon: '🥐' },
    { id: 'korean', label: 'Korean', icon: '🥘' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'it', label: 'Italiano' },
    { value: 'pt', label: 'Português' }
  ];

  const currencyOptions = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' },
    { value: 'AUD', label: 'AUD (A$)' }
  ];

  const handleDietaryChange = (restrictionId, checked) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, restrictionId]
        : prev.dietaryRestrictions.filter(id => id !== restrictionId)
    }));
  };

  const handleCuisineChange = (cuisineId, checked) => {
    setFormData(prev => ({
      ...prev,
      cuisinePreferences: checked
        ? [...prev.cuisinePreferences, cuisineId]
        : prev.cuisinePreferences.filter(id => id !== cuisineId)
    }));
  };

  const handleNotificationChange = (key, checked) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: checked
      }
    }));
  };

  const handleSave = () => {
    onUpdatePreferences(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      dietaryRestrictions: preferences.dietaryRestrictions || [],
      cuisinePreferences: preferences.cuisinePreferences || [],
      notifications: preferences.notifications || {
        orderUpdates: true,
        promotions: false,
        newChefs: true,
        weeklyDigest: false
      },
      language: preferences.language || 'en',
      currency: preferences.currency || 'USD'
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            iconPosition="left"
          >
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Dietary Restrictions */}
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Leaf" size={18} className="mr-2 text-success" />
            Dietary Restrictions
          </h3>
          <CheckboxGroup>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="border border-border rounded-lg p-3">
                  <Checkbox
                    label={option.label}
                    description={option.description}
                    checked={formData.dietaryRestrictions.includes(option.id)}
                    onChange={(e) => handleDietaryChange(option.id, e.target.checked)}
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          </CheckboxGroup>
        </div>

        {/* Cuisine Preferences */}
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="ChefHat" size={18} className="mr-2 text-primary" />
            Favorite Cuisines
          </h3>
          <CheckboxGroup>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {cuisineOptions.map((cuisine) => (
                <div key={cuisine.id} className="border border-border rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">{cuisine.icon}</div>
                  <Checkbox
                    label={cuisine.label}
                    checked={formData.cuisinePreferences.includes(cuisine.id)}
                    onChange={(e) => handleCuisineChange(cuisine.id, e.target.checked)}
                    disabled={!isEditing}
                  />
                </div>
              ))}
            </div>
          </CheckboxGroup>
        </div>

        {/* Notification Settings */}
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Bell" size={18} className="mr-2 text-accent" />
            Notification Preferences
          </h3>
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <Checkbox
                label="Order Updates"
                description="Get notified about order status changes and delivery updates"
                checked={formData.notifications.orderUpdates}
                onChange={(e) => handleNotificationChange('orderUpdates', e.target.checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <Checkbox
                label="New Chefs in Area"
                description="Be the first to know when new chefs join your neighborhood"
                checked={formData.notifications.newChefs}
                onChange={(e) => handleNotificationChange('newChefs', e.target.checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <Checkbox
                label="Promotions & Offers"
                description="Receive special deals and promotional offers"
                checked={formData.notifications.promotions}
                onChange={(e) => handleNotificationChange('promotions', e.target.checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <Checkbox
                label="Weekly Digest"
                description="Get a weekly summary of new menus and featured dishes"
                checked={formData.notifications.weeklyDigest}
                onChange={(e) => handleNotificationChange('weeklyDigest', e.target.checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Language & Currency */}
        <div>
          <h3 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Globe" size={18} className="mr-2 text-secondary" />
            Language & Currency
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Language"
              options={languageOptions}
              value={formData.language}
              onChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
              disabled={!isEditing}
            />
            
            <Select
              label="Currency"
              options={currencyOptions}
              value={formData.currency}
              onChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={16} className="text-success mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Privacy & Data</p>
              <p className="text-muted-foreground">
                Your preferences help us personalize your experience. We never share your dietary 
                restrictions or personal preferences with chefs or third parties without your consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSection;