import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MenuCard = ({ dish, onEdit, onDelete, onToggleAvailability }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(dish.id);
    setIsDeleting(false);
  };

  const getAvailabilityColor = () => {
    if (dish.quantity === 0) return 'text-error';
    if (dish.quantity <= 5) return 'text-warning';
    return 'text-success';
  };

  const getAvailabilityText = () => {
    if (dish.quantity === 0) return 'Out of Stock';
    if (dish.quantity <= 5) return `Only ${dish.quantity} left`;
    return `${dish.quantity} available`;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm-sm overflow-hidden">
      <div className="relative">
        <div className="h-48 overflow-hidden">
          <Image
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={() => onToggleAvailability(dish.id)}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              dish.isAvailable
                ? 'bg-success text-success-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {dish.isAvailable ? 'Available' : 'Unavailable'}
          </button>
        </div>
        {dish.isNew && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
              New
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">
            {dish.name}
          </h3>
          <div className="flex items-center space-x-1 ml-2">
            <Icon name="Star" size={16} className="text-warning fill-current" />
            <span className="text-sm font-medium text-foreground">
              {dish.rating}
            </span>
            <span className="text-xs text-muted-foreground">
              ({dish.reviews})
            </span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {dish.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {dish.dietaryTags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">
              ₹{dish.price}
            </span>
            {dish.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{dish.originalPrice}
              </span>
            )}
          </div>
          <span className={`text-sm font-medium ${getAvailabilityColor()}`}>
            {getAvailabilityText()}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{dish.prepTime} mins</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} />
            <span>Serves {dish.serves}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="ShoppingCart" size={14} />
            <span>{dish.orders} orders</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(dish)}
            iconName="Edit"
            iconPosition="left"
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            loading={isDeleting}
            iconName="Trash2"
            iconPosition="left"
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;