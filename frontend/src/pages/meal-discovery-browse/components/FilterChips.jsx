import React from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ 
  activeFilters, 
  onFilterToggle, 
  onOpenFilterPanel,
  totalActiveFilters 
}) => {
  const filterChips = [
    { id: 'cuisine', label: 'Cuisine', icon: 'Utensils' },
    { id: 'dietary', label: 'Dietary', icon: 'Leaf' },
    { id: 'price', label: 'Price', icon: 'DollarSign' },
    { id: 'delivery', label: 'Delivery Time', icon: 'Clock' }
  ];

  return (
    <div className="sticky top-[176px] z-30 bg-background border-b border-border shadow-warm-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
          {/* Filter Button */}
          <button
            onClick={onOpenFilterPanel}
            className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors"
          >
            <Icon name="Filter" size={16} />
            <span>Filters</span>
            {totalActiveFilters > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-mono">
                {totalActiveFilters}
              </span>
            )}
          </button>

          {/* Filter Chips */}
          {filterChips.map((chip) => {
            const isActive = activeFilters[chip.id] && 
              (Array.isArray(activeFilters[chip.id]) ? 
                activeFilters[chip.id].length > 0 : 
                activeFilters[chip.id]);
            
            return (
              <button
                key={chip.id}
                onClick={() => onFilterToggle(chip.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:bg-muted'
                }`}
              >
                <Icon name={chip.icon} size={16} />
                <span>{chip.label}</span>
                {isActive && (
                  <span className="bg-primary-foreground/20 text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-mono">
                    {Array.isArray(activeFilters[chip.id]) ? 
                      activeFilters[chip.id].length : 
                      1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterChips;