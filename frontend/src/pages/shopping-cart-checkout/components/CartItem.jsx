import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CartItem = ({ item, onUpdateQuantity, onRemove, onUpdateInstructions }) => {
  const [instructions, setInstructions] = useState(item.specialInstructions || '');
  const [showInstructions, setShowInstructions] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      onRemove(item.id);
    } else {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleInstructionsChange = (e) => {
    const value = e.target.value;
    setInstructions(value);
    onUpdateInstructions(item.id, value);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-warm-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Item Image */}
        <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Item Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                {item.name}
              </h3>
              <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                <Icon name="ChefHat" size={14} />
                {item.chefName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-primary font-semibold">₹{item.price.toFixed(2)}</span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-muted-foreground text-sm line-through">
                    ₹{item.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              iconName="Trash2"
              className="text-error hover:text-error hover:bg-error/10 self-start"
            />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  iconName="Minus"
                  className="h-8 w-8 rounded-r-none border-r border-border"
                />
                <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  iconName="Plus"
                  className="h-8 w-8 rounded-l-none border-l border-border"
                />
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-foreground">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInstructions(!showInstructions)}
              iconName={showInstructions ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
              className="text-muted-foreground hover:text-foreground p-0 h-auto"
            >
              Special Instructions
            </Button>
            
            {showInstructions && (
              <div className="mt-2">
                <textarea
                  value={instructions}
                  onChange={handleInstructionsChange}
                  placeholder="Add any special instructions for the chef..."
                  className="w-full p-2 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  rows={2}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {instructions.length}/200 characters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;