import React from 'react';
import Icon from './AppIcon';

const QuantitySelector = ({ value, onChange, min = 1, max = 99, disabled = false }) => {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center border border-border rounded-md overflow-hidden">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min || disabled}
        className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Icon name="Minus" size={16} />
      </button>
      
      <div className="w-10 h-10 flex items-center justify-center font-medium text-foreground">
        {value}
      </div>
      
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max || disabled}
        className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Icon name="Plus" size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;