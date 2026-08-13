import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SearchAndSort = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  onSortChange,
  locationRadius,
  onRadiusChange 
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'delivery_time', label: 'Fastest Delivery' },
    { value: 'newest', label: 'Newest First' }
  ];

  const radiusOptions = [
    { value: '1', label: 'Within 1 mile' },
    { value: '3', label: 'Within 3 miles' },
    { value: '5', label: 'Within 5 miles' },
    { value: '10', label: 'Within 10 miles' },
    { value: '15', label: 'Within 15 miles' }
  ];

  return (
    <div className="sticky top-[104px] z-40 bg-card border-b border-border shadow-warm-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search meals, chefs, or cuisines..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          {/* Sort and Radius Controls */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Location Radius */}
            <div className="min-w-[160px]">
              <Select
                options={radiusOptions}
                value={locationRadius}
                onChange={onRadiusChange}
                placeholder="Search radius"
              />
            </div>

            {/* Sort By */}
            <div className="min-w-[180px]">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                placeholder="Sort by"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndSort;