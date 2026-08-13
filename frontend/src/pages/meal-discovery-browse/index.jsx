import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import FilterChips from './components/FilterChips';
import FilterPanel from './components/FilterPanel';
import SearchAndSort from './components/SearchAndSort';
import MealGrid from './components/MealGrid';
import LocationSelector from './components/LocationSelector';
import authService from '../../utils/authService';
import cartService from '../../utils/cartService';
import { toast } from 'react-hot-toast';

const MealDiscoveryBrowse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [locationRadius, setLocationRadius] = useState('5');
  const [currentLocation, setCurrentLocation] = useState(() => {
    return localStorage.getItem('currentLocation') || 'Delhi, India';
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const [filters, setFilters] = useState({
    cuisine: [],
    dietary: [],
    price: [],
    delivery: []
  });

  // Empty array for meals
  const mockMeals = [];

  // Filter and sort meals
  const getFilteredAndSortedMeals = useCallback(() => {
    let filteredMeals = [...mockMeals];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredMeals = filteredMeals.filter(meal =>
        meal.name.toLowerCase().includes(query) ||
        meal.description.toLowerCase().includes(query) ||
        meal.chef.name.toLowerCase().includes(query) ||
        meal.cuisine.toLowerCase().includes(query) ||
        meal.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply cuisine filter
    if (filters.cuisine.length > 0) {
      filteredMeals = filteredMeals.filter(meal =>
        filters.cuisine.includes(meal.cuisine)
      );
    }

    // Apply dietary filter
    if (filters.dietary.length > 0) {
      filteredMeals = filteredMeals.filter(meal =>
        filters.dietary.some(diet => meal.dietary.includes(diet))
      );
    }

    // Apply price filter
    if (filters.price.length > 0) {
      filteredMeals = filteredMeals.filter(meal => {
        return filters.price.some(priceRange => {
          switch (priceRange) {
            case 'budget':
              return meal.price >= 5 && meal.price <= 15;
            case 'moderate':
              return meal.price > 15 && meal.price <= 25;
            case 'premium':
              return meal.price > 25;
            default:
              return true;
          }
        });
      });
    }

    // Apply delivery time filter
    if (filters.delivery.length > 0) {
      filteredMeals = filteredMeals.filter(meal => {
        return filters.delivery.some(timeRange => {
          switch (timeRange) {
            case '30min':
              return meal.deliveryTime <= 30;
            case '45min':
              return meal.deliveryTime > 30 && meal.deliveryTime <= 45;
            case '60min':
              return meal.deliveryTime > 45 && meal.deliveryTime <= 60;
            case '60plus':
              return meal.deliveryTime > 60;
            default:
              return true;
          }
        });
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        filteredMeals.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filteredMeals.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredMeals.sort((a, b) => b.chef.rating - a.chef.rating);
        break;
      case 'delivery_time':
        filteredMeals.sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      case 'newest':
        filteredMeals.sort((a, b) => b.isNew - a.isNew);
        break;
      default: // relevance
        filteredMeals.sort((a, b) => a.distance - b.distance);
    }

    return filteredMeals;
  }, [searchQuery, filters, sortBy]);

  // Load meals from API
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        // Import mealService dynamically to avoid circular dependencies
        const { mealService } = await import('../../utils');
        
        // Prepare filters for API
        const apiFilters = {};
        
        if (searchQuery) {
          apiFilters.searchQuery = searchQuery;
        }
        
        if (filters.cuisine.length > 0) {
          apiFilters.cuisine = filters.cuisine.join(',');
        }
        
        if (filters.dietary.length > 0) {
          apiFilters.dietary = filters.dietary.join(',');
        }
        
        // Price and delivery filters would need to be handled on the backend
        // or we can filter the results client-side after fetching
        
        const fetchedMeals = await mealService.getMeals(apiFilters);
        
        // Apply client-side filtering for price and delivery time
        let filteredMeals = fetchedMeals;
        
        // Apply price filter
        if (filters.price.length > 0) {
          filteredMeals = filteredMeals.filter(meal => {
            return filters.price.some(priceRange => {
              switch (priceRange) {
                case 'budget':
                  return meal.price >= 5 && meal.price <= 15;
                case 'moderate':
                  return meal.price > 15 && meal.price <= 25;
                case 'premium':
                  return meal.price > 25;
                default:
                  return true;
              }
            });
          });
        }
        
        // Apply delivery time filter
        if (filters.delivery.length > 0) {
          filteredMeals = filteredMeals.filter(meal => {
            return filters.delivery.some(timeRange => {
              switch (timeRange) {
                case '30min':
                  return meal.prepTime <= 30;
                case '45min':
                  return meal.prepTime > 30 && meal.prepTime <= 45;
                case '60min':
                  return meal.prepTime > 45 && meal.prepTime <= 60;
                case '60plus':
                  return meal.prepTime > 60;
                default:
                  return true;
              }
            });
          });
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'price_low':
            filteredMeals.sort((a, b) => a.price - b.price);
            break;
          case 'price_high':
            filteredMeals.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredMeals.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
          case 'delivery_time':
            filteredMeals.sort((a, b) => (a.prepTime || 0) - (b.prepTime || 0));
            break;
          case 'newest':
            filteredMeals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          default: // relevance - we'll use the order from the API
            break;
        }
        
        setMeals(filteredMeals);
        setHasMore(filteredMeals.length >= 20); // Assuming backend pagination of 20 items
      } catch (error) {
        console.error('Failed to fetch meals:', error);
        // If API fails, set empty meals array
        setMeals([]);
        toast.error('Failed to load meals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeals();
  }, [getFilteredAndSortedMeals]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleFilterToggle = (filterType) => {
    // This could open specific filter sections
    setIsFilterPanelOpen(true);
  };

  const handleClearAllFilters = () => {
    setFilters({
      cuisine: [],
      dietary: [],
      price: [],
      delivery: []
    });
  };

  const handleApplyFilters = () => {
    setIsFilterPanelOpen(false);
  };

  // Calculate total active filters
  const getTotalActiveFilters = () => {
    return Object.values(filters).reduce((total, filterArray) => {
      return total + (Array.isArray(filterArray) ? filterArray.length : 0);
    }, 0);
  };

  // Handle add to cart
  const handleAddToCart = async (meal) => {
    // Check if user is authenticated
    const isAuthenticated = authService.isAuthenticated();
    
    if (!isAuthenticated) {
      // Redirect to login page with the return url
      toast.error('Please log in to add items to your cart');
      navigate('/user-registration-login', { state: { from: window.location.pathname } });
      return;
    }
    
    try {
      // Use cartService to add to cart
      await cartService.addToCart({
        mealId: meal.id,
        quantity: 1,
      });
      toast.success('Added to cart successfully!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  // Handle toggle favorite
  const handleToggleFavorite = (mealId) => {
    setMeals(prev => prev.map(meal => 
      meal.id === mealId 
        ? { ...meal, isFavorite: !meal.isFavorite }
        : meal
    ));
  };

  // Handle location change
  const handleLocationChange = (newLocation) => {
    setCurrentLocation(newLocation);
    localStorage.setItem('currentLocation', newLocation);
    
    // If we're using the location selector, we should update the header as well
    // This ensures the header displays the same location
    document.dispatchEvent(new CustomEvent('locationUpdated', { detail: { location: newLocation } }));
  };
  
  // Handle location detection
  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    
    // The actual detection happens in the LocationSelector component
    // This is just to update the state in this component
    setTimeout(() => {
      setIsDetectingLocation(false);
    }, 3000); // Timeout in case the detection fails
  };

  // Handle load more
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    // In real app, this would load more data
  };

  // Pull to refresh (mobile)
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredMeals = getFilteredAndSortedMeals();
      setMeals(filteredMeals);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Search and Sort Section */}
      <SearchAndSort
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        locationRadius={locationRadius}
        onRadiusChange={setLocationRadius}
      />

      {/* Filter Chips */}
      <FilterChips
        activeFilters={filters}
        onFilterToggle={handleFilterToggle}
        onOpenFilterPanel={() => setIsFilterPanelOpen(true)}
        totalActiveFilters={getTotalActiveFilters()}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-[200px]">
              {/* Location Selector */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Delivery Location
                </h3>
                <LocationSelector
                  currentLocation={currentLocation}
                  onLocationChange={handleLocationChange}
                  isDetecting={isDetectingLocation}
                  onDetectStart={handleDetectLocation}
                />
              </div>

              {/* Filter Panel */}
              <FilterPanel
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={handleClearAllFilters}
                onApplyFilters={handleApplyFilters}
              />
            </div>
          </div>

          {/* Meal Grid */}
          <div className="flex-1">
            {/* Mobile Location Selector */}
            <div className="lg:hidden mb-6">
              <LocationSelector
                currentLocation={currentLocation}
                onLocationChange={handleLocationChange}
                isDetecting={isDetectingLocation}
                onDetectStart={handleDetectLocation}
              />
            </div>

            {/* Pull to Refresh Indicator */}
            <div className="lg:hidden mb-4">
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="RefreshCw" size={16} />
                <span>Pull to refresh</span>
              </button>
            </div>

            <MealGrid
              meals={meals}
              loading={loading}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <FilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAllFilters}
        onApplyFilters={handleApplyFilters}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MealDiscoveryBrowse;