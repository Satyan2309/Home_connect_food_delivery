import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onClearAll,
  onApplyFilters 
}) => {
  const cuisineTypes = [
    'Italian', 'Chinese', 'Indian', 'Mexican', 'Thai', 'Japanese', 
    'Mediterranean', 'American', 'French', 'Korean'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Low-Carb', 
    'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher'
  ];

  const priceRanges = [
    { id: 'budget', label: 'Budget (₹5-₹15)', value: [5, 15] },
    { id: 'moderate', label: 'Moderate (₹15-₹25)', value: [15, 25] },
    { id: 'premium', label: 'Premium (₹25+)', value: [25, 100] }
  ];

  const deliveryTimes = [
    { id: '30min', label: 'Under 30 minutes' },
    { id: '45min', label: '30-45 minutes' },
    { id: '60min', label: '45-60 minutes' },
    { id: '60plus', label: 'Over 60 minutes' }
  ];

  const handleCuisineChange = (cuisine, checked) => {
    const currentCuisines = filters.cuisine || [];
    const updatedCuisines = checked
      ? [...currentCuisines, cuisine]
      : currentCuisines.filter(c => c !== cuisine);
    onFilterChange('cuisine', updatedCuisines);
  };

  const handleDietaryChange = (dietary, checked) => {
    const currentDietary = filters.dietary || [];
    const updatedDietary = checked
      ? [...currentDietary, dietary]
      : currentDietary.filter(d => d !== dietary);
    onFilterChange('dietary', updatedDietary);
  };

  const handlePriceChange = (priceRange, checked) => {
    const currentPrices = filters.price || [];
    const updatedPrices = checked
      ? [...currentPrices, priceRange]
      : currentPrices.filter(p => p !== priceRange);
    onFilterChange('price', updatedPrices);
  };

  const handleDeliveryChange = (deliveryTime, checked) => {
    const currentDelivery = filters.delivery || [];
    const updatedDelivery = checked
      ? [...currentDelivery, deliveryTime]
      : currentDelivery.filter(d => d !== deliveryTime);
    onFilterChange('delivery', updatedDelivery);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl max-h-[80vh] overflow-hidden lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:rounded-lg lg:max-h-none lg:border lg:border-border lg:shadow-warm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Filters</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-muted-foreground"
            >
              Clear All
            </Button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)] lg:max-h-96">
          <div className="p-4 space-y-6">
            {/* Cuisine Type */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Icon name="Utensils" size={16} className="mr-2" />
                Cuisine Type
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {cuisineTypes.map((cuisine) => (
                  <Checkbox
                    key={cuisine}
                    label={cuisine}
                    checked={(filters.cuisine || []).includes(cuisine)}
                    onChange={(e) => handleCuisineChange(cuisine, e.target.checked)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Dietary Preferences */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Icon name="Leaf" size={16} className="mr-2" />
                Dietary Preferences
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map((dietary) => (
                  <Checkbox
                    key={dietary}
                    label={dietary}
                    checked={(filters.dietary || []).includes(dietary)}
                    onChange={(e) => handleDietaryChange(dietary, e.target.checked)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Icon name="DollarSign" size={16} className="mr-2" />
                Price Range
              </h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <Checkbox
                    key={range.id}
                    label={range.label}
                    checked={(filters.price || []).includes(range.id)}
                    onChange={(e) => handlePriceChange(range.id, e.target.checked)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            {/* Delivery Time */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Icon name="Clock" size={16} className="mr-2" />
                Delivery Time
              </h4>
              <div className="space-y-2">
                {deliveryTimes.map((time) => (
                  <Checkbox
                    key={time.id}
                    label={time.label}
                    checked={(filters.delivery || []).includes(time.id)}
                    onChange={(e) => handleDeliveryChange(time.id, e.target.checked)}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/50">
          <Button
            variant="default"
            fullWidth
            onClick={onApplyFilters}
            iconName="Check"
            iconPosition="left"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;