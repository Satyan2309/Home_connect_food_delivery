import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OrderFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  isExpanded, 
  onToggleExpanded 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'highest_amount', label: 'Highest Amount' },
    { value: 'lowest_amount', label: 'Lowest Amount' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = () => {
    return filters.search || 
           filters.status !== 'all' || 
           filters.timeRange !== 'all' ||
           filters.minAmount ||
           filters.maxAmount;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm-sm p-4 mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filter Orders</h3>
          {hasActiveFilters() && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          >
            {isExpanded ? 'Less' : 'More'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search by order ID, chef name, or dish..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full"
        />
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select
          label="Order Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
        />
        
        <Select
          label="Time Range"
          options={timeRangeOptions}
          value={filters.timeRange}
          onChange={(value) => handleFilterChange('timeRange', value)}
        />
        
        <Select
          label="Sort By"
          options={sortOptions}
          value={filters.sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border">
          {/* Custom Date Range */}
          {filters.timeRange === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="From Date"
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
              />
              <Input
                label="To Date"
                type="date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
              />
            </div>
          )}

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Minimum Amount"
              type="number"
              placeholder="₹0.00"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
            />
            <Input
              label="Maximum Amount"
              type="number"
              placeholder="₹999.00"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
            />
          </div>

          {/* Chef Filter */}
          <div>
            <Input
              label="Chef Name"
              type="text"
              placeholder="Filter by specific chef..."
              value={filters.chefName}
              onChange={(e) => handleFilterChange('chefName', e.target.value)}
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Minimum Rating
            </label>
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleFilterChange('minRating', rating)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg border transition-colors ${
                    filters.minRating === rating
                      ? 'border-primary bg-primary/10 text-primary' :'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon
                    name="Star"
                    size={16}
                    className={filters.minRating === rating ? 'text-warning fill-current' : 'text-muted-foreground'}
                  />
                  <span className="text-sm">{rating}+</span>
                </button>
              ))}
              {filters.minRating && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange('minRating', null)}
                  iconName="X"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;