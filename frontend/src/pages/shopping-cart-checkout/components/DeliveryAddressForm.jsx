import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const DeliveryAddressForm = ({ savedAddresses, selectedAddress, onAddressSelect, onAddAddress }) => {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: '',
    isDefault: false
  });
  const [errors, setErrors] = useState({});
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const addressTypes = [
    { value: 'home', label: 'Home', icon: 'Home' },
    { value: 'work', label: 'Work', icon: 'Building' },
    { value: 'other', label: 'Other', icon: 'MapPin' }
  ];

  const handleInputChange = (field, value) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const detectCurrentLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock reverse geocoding
          setTimeout(() => {
            setNewAddress(prev => ({
              ...prev,
              street: '123 Main Street',
              city: 'San Francisco',
              state: 'CA',
              zipCode: '94102'
            }));
            setIsDetectingLocation(false);
          }, 1500);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsDetectingLocation(false);
        }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newAddress.street.trim()) newErrors.street = 'Street address is required';
    if (!newAddress.city.trim()) newErrors.city = 'City is required';
    if (!newAddress.state.trim()) newErrors.state = 'State is required';
    if (!newAddress.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(newAddress.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = () => {
    if (validateForm()) {
      const addressToAdd = {
        ...newAddress,
        id: Date.now().toString(),
        fullAddress: `${newAddress.street}${newAddress.apartment ? ', ' + newAddress.apartment : ''}, ${newAddress.city}, ${newAddress.state} ${newAddress.zipCode}`
      };
      
      onAddAddress(addressToAdd);
      setNewAddress({
        type: 'home',
        street: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        instructions: '',
        isDefault: false
      });
      setShowNewAddressForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
          <Icon name="MapPin" size={20} />
          Delivery Address
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowNewAddressForm(!showNewAddressForm)}
          iconName="Plus"
          iconPosition="left"
        >
          Add New
        </Button>
      </div>

      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div className="space-y-3">
          {savedAddresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedAddress?.id === address.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => onAddressSelect(address)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                  selectedAddress?.id === address.id
                    ? 'border-primary bg-primary' :'border-muted-foreground'
                }`}>
                  {selectedAddress?.id === address.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon 
                      name={addressTypes.find(t => t.value === address.type)?.icon || 'MapPin'} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                    <span className="font-medium text-foreground capitalize">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{address.fullAddress}</p>
                  {address.instructions && (
                    <p className="text-muted-foreground text-xs mt-1 italic">
                      Note: {address.instructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Address Form */}
      {showNewAddressForm && (
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <h4 className="font-medium text-foreground mb-4">Add New Address</h4>
          
          {/* Address Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Address Type
            </label>
            <div className="flex gap-2">
              {addressTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('type', type.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    newAddress.type === type.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={type.icon} size={16} />
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Detection */}
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={detectCurrentLocation}
              loading={isDetectingLocation}
              iconName="Navigation"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              {isDetectingLocation ? 'Detecting...' : 'Use Current Location'}
            </Button>
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Street Address"
                type="text"
                placeholder="123 Main Street"
                value={newAddress.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                error={errors.street}
                required
              />
            </div>
            
            <div className="sm:col-span-2">
              <Input
                label="Apartment, Suite, etc."
                type="text"
                placeholder="Apt 4B (optional)"
                value={newAddress.apartment}
                onChange={(e) => handleInputChange('apartment', e.target.value)}
              />
            </div>
            
            <Input
              label="City"
              type="text"
              placeholder="San Francisco"
              value={newAddress.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              error={errors.city}
              required
            />
            
            <Input
              label="State"
              type="text"
              placeholder="CA"
              value={newAddress.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              error={errors.state}
              required
            />
            
            <div className="sm:col-span-2">
              <Input
                label="ZIP Code"
                type="text"
                placeholder="94102"
                value={newAddress.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                error={errors.zipCode}
                required
              />
            </div>
            
            <div className="sm:col-span-2">
              <Input
                label="Delivery Instructions"
                type="text"
                placeholder="Ring doorbell, leave at door, etc."
                value={newAddress.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
              />
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="mt-4">
            <Checkbox
              label="Set as default address"
              checked={newAddress.isDefault}
              onChange={(e) => handleInputChange('isDefault', e.target.checked)}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              variant="default"
              onClick={handleAddAddress}
              iconName="Plus"
              iconPosition="left"
            >
              Add Address
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNewAddressForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddressForm;