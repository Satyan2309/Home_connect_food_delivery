import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MealCard = ({ meal, onAddToCart, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await onAddToCart(meal);
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getDeliveryTimeColor = (time) => {
    if (time <= 30) return 'text-success';
    if (time <= 45) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm hover:shadow-warm-lg transition-all duration-300 overflow-hidden group">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link to={`/meal-details/${meal.id}`}>
          <div className="aspect-[4/3] overflow-hidden">
            <Image
              src={meal.image}
              alt={meal.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        
        {/* Favorite Button */}
        <button
          onClick={() => onToggleFavorite(meal.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <Icon 
            name={meal.isFavorite ? "Heart" : "Heart"} 
            size={16} 
            className={meal.isFavorite ? "text-error fill-current" : "text-muted-foreground"}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {meal.isNew && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
              New
            </span>
          )}
          {meal.isPopular && (
            <span className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full">
              Popular
            </span>
          )}
          {meal.dietary && meal.dietary.length > 0 && (
            <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
              {meal.dietary[0]}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Chef Info */}
        <div 
          onClick={(e) => {
            e.preventDefault();
            // Check if user is authenticated
            const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
            if (isAuthenticated) {
              navigate(`/chef-profile/${meal.chefId}`);
            } else {
              // Redirect to login page with return URL
              const returnUrl = `/chef-profile/${meal.chefId}`;
              navigate(`/user-registration-login?returnUrl=${encodeURIComponent(returnUrl)}`);
            }
          }}
          className="flex items-center space-x-2 mb-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={meal.chef.avatar}
              alt={meal.chef.name}
              className="w-full h-full object-cover"
              isAvatar={true}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {meal.chef.name}
            </p>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={12} className="text-warning fill-current" />
              <span className="text-xs text-muted-foreground">
                {meal.chef.rating} ({meal.chef.reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Meal Info */}
        <Link to={`/meal-details/${meal.id}`}>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
            {meal.name}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {meal.description}
        </p>

        {/* Tags */}
        {meal.tags && meal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {meal.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${meal.id}-tag-${index}`}
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {meal.tags.length > 3 && (
              <span key={`${meal.id}-tag-more`} className="text-xs text-muted-foreground px-2 py-1">
                +{meal.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price and Delivery Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(meal.price)}
            </span>
            {meal.originalPrice && meal.originalPrice > meal.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(meal.originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} className={getDeliveryTimeColor(meal.deliveryTime)} />
            <span className={`text-sm font-medium ${getDeliveryTimeColor(meal.deliveryTime)}`}>
              {meal.deliveryTime} min
            </span>
          </div>
        </div>

        {/* Availability and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${meal.isAvailable ? 'bg-success' : 'bg-error'}`} />
            <span className="text-xs text-muted-foreground">
              {meal.isAvailable ? `${meal.availableQuantity} available` : 'Sold out'}
            </span>
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleAddToCart}
            disabled={!meal.isAvailable || isAddingToCart}
            loading={isAddingToCart}
            iconName="Plus"
            iconPosition="left"
            className="min-w-[100px]"
          >
            {isAddingToCart ? 'Adding...' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MealCard;