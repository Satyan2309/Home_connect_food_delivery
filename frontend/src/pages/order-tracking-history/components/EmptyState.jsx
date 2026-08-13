import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';

const EmptyState = ({ type, onClearFilters }) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'no-active-orders':
        return {
          icon: 'ShoppingBag',
          title: 'No Active Orders',
          description: 'You don\'t have any orders in progress right now.',
          actionText: 'Browse Meals',
          actionLink: '/meal-discovery-browse'
        };
      case 'no-order-history':
        return {
          icon: 'Clock',
          title: 'No Order History',
          description: 'You haven\'t placed any orders yet. Start exploring delicious homemade meals!',
          actionText: 'Discover Meals',
          actionLink: '/meal-discovery-browse'
        };
      case 'no-search-results':
        return {
          icon: 'Search',
          title: 'No Orders Found',
          description: 'We couldn\'t find any orders matching your search criteria.',
          actionText: 'Clear Filters',
          actionLink: null,
          onClick: onClearFilters
        };
      default:
        return {
          icon: 'ShoppingBag',
          title: 'No Orders',
          description: 'Start your culinary journey today!',
          actionText: 'Browse Meals',
          actionLink: '/meal-discovery-browse'
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon 
          name={content.icon} 
          size={40} 
          className="text-muted-foreground" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {content.title}
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-md">
        {content.description}
      </p>
      
      {content.actionLink ? (
        <Link to={content.actionLink}>
          <Button 
            variant="default"
            iconName="ArrowRight"
            iconPosition="right"
          >
            {content.actionText}
          </Button>
        </Link>
      ) : (
        <Button 
          variant="default"
          onClick={content.onClick}
          iconName="RotateCcw"
          iconPosition="left"
        >
          {content.actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;