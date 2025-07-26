import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DeliveryAddressSection = ({ addresses, onUpdateAddresses }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    label: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    instructions: '',
    isPrimary: false
  });
  const [errors, setErrors] = useState({});

  const addressTypes = [
    { value: 'home', label: 'Home' },
    { value: 'work', label: 'Work' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateAddress = () => {
    const newErrors = {};
    
    if (!newAddress.label.trim()) {
      newErrors.label = 'Address label is required';
    }
    
    if (!newAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    
    if (!newAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!newAddress.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!newAddress.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(newAddress.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = () => {
    if (validateAddress()) {
      const addressToSave = {
        ...newAddress,
        id: editingId || Date.now().toString()
      };
      
      if (editingId) {
        const updatedAddresses = addresses.map(addr => 
          addr.id === editingId ? addressToSave : addr
        );
        onUpdateAddresses(updatedAddresses);
        setEditingId(null);
      } else {
        onUpdateAddresses([...addresses, addressToSave]);
        setIsAddingNew(false);
      }
      
      setNewAddress({
        type: 'home',
        label: '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        instructions: '',
        isPrimary: false
      });
      setErrors({});
    }
  };

  const handleEditAddress = (address) => {
    setNewAddress(address);
    setEditingId(address.id);
    setIsAddingNew(true);
  };

  const handleDeleteAddress = (addressId) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    onUpdateAddresses(updatedAddresses);
  };

  const handleSetPrimary = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isPrimary: addr.id === addressId
    }));
    onUpdateAddresses(updatedAddresses);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setNewAddress({
      type: 'home',
      label: '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      instructions: '',
      isPrimary: false
    });
    setErrors({});
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock reverse geocoding
          setNewAddress(prev => ({
            ...prev,
            street: '123 Current Location St',
            city: 'Your City',
            state: 'Your State',
            zipCode: '12345'
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Delivery Addresses</h2>
        {!isAddingNew && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNew(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Address
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Existing Addresses */}
        {addresses.map((address) => (
          <div
            key={address.id}
            className="border border-border rounded-lg p-4 hover:shadow-warm-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon 
                    name={address.type === 'home' ? 'Home' : address.type === 'work' ? 'Building' : 'MapPin'} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                  <span className="font-medium text-foreground">{address.label}</span>
                  {address.isPrimary && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{address.street}</p>
                  {address.apartment && <p>Apt {address.apartment}</p>}
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                  {address.instructions && (
                    <p className="italic">Instructions: {address.instructions}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {!address.isPrimary && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetPrimary(address.id)}
                    className="text-xs"
                  >
                    Set Primary
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditAddress(address)}
                  iconName="Edit"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAddress(address.id)}
                  iconName="Trash2"
                  className="text-error hover:text-error"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add/Edit Address Form */}
        {isAddingNew && (
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
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
                  onClick={handleSaveAddress}
                >
                  Save
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Address Type"
                  options={addressTypes}
                  value={newAddress.type}
                  onChange={(value) => setNewAddress(prev => ({ ...prev, type: value }))}
                />
                
                <Input
                  label="Address Label"
                  name="label"
                  type="text"
                  value={newAddress.label}
                  onChange={handleInputChange}
                  error={errors.label}
                  required
                  placeholder="e.g., Home, Office"
                />
              </div>

              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Input
                    label="Street Address"
                    name="street"
                    type="text"
                    value={newAddress.street}
                    onChange={handleInputChange}
                    error={errors.street}
                    required
                    placeholder="Enter street address"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUseCurrentLocation}
                  iconName="MapPin"
                  className="mb-1"
                >
                  Use Current
                </Button>
              </div>

              <Input
                label="Apartment/Suite (Optional)"
                name="apartment"
                type="text"
                value={newAddress.apartment}
                onChange={handleInputChange}
                placeholder="Apt, Suite, Unit, etc."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  name="city"
                  type="text"
                  value={newAddress.city}
                  onChange={handleInputChange}
                  error={errors.city}
                  required
                  placeholder="Enter city"
                />
                
                <Input
                  label="State"
                  name="state"
                  type="text"
                  value={newAddress.state}
                  onChange={handleInputChange}
                  error={errors.state}
                  required
                  placeholder="Enter state"
                />
                
                <Input
                  label="ZIP Code"
                  name="zipCode"
                  type="text"
                  value={newAddress.zipCode}
                  onChange={handleInputChange}
                  error={errors.zipCode}
                  required
                  placeholder="12345"
                />
              </div>

              <Input
                label="Delivery Instructions (Optional)"
                name="instructions"
                type="text"
                value={newAddress.instructions}
                onChange={handleInputChange}
                placeholder="e.g., Ring doorbell, Leave at door"
                description="Help delivery partners find you easily"
              />
            </div>
          </div>
        )}

        {addresses.length === 0 && !isAddingNew && (
          <div className="text-center py-8">
            <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No addresses saved</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your delivery addresses to make ordering faster
            </p>
            <Button
              variant="default"
              onClick={() => setIsAddingNew(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Add Your First Address
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryAddressSection;