import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderSummary = ({ items, deliveryFee, taxes, promoCode, onApplyPromo, onRemovePromo }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const promoDiscount = promoCode?.discount || 0;
  const discountAmount = subtotal * (promoDiscount / 100);
  const total = subtotal - discountAmount + deliveryFee + taxes;

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-warm-sm sticky top-4">
      <h3 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
        <Icon name="Receipt" size={20} />
        Order Summary
      </h3>

      {/* Items Count */}
      <div className="flex justify-between items-center py-2 border-b border-border">
        <span className="text-muted-foreground">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
        <span className="font-medium">₹{subtotal.toFixed(2)}</span>
      </div>

      {/* Promo Code */}
      {promoCode ? (
        <div className="flex justify-between items-center py-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Icon name="Tag" size={16} className="text-success" />
            <span className="text-success text-sm">{promoCode.code}</span>
            <button
              onClick={onRemovePromo}
              className="text-muted-foreground hover:text-error transition-colors"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
          <span className="text-success font-medium">-₹{discountAmount.toFixed(2)}</span>
        </div>
      ) : (
        <div className="py-2 border-b border-border">
          <button
            onClick={onApplyPromo}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
          >
            <Icon name="Tag" size={16} />
            Add promo code
          </button>
        </div>
      )}

      {/* Delivery Fee */}
      <div className="flex justify-between items-center py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Truck" size={16} className="text-muted-foreground" />
          <span className="text-muted-foreground">Delivery fee</span>
        </div>
        <span className="font-medium">
          {deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}
        </span>
      </div>

      {/* Taxes */}
      <div className="flex justify-between items-center py-2 border-b border-border">
        <span className="text-muted-foreground">Taxes & fees</span>
        <span className="font-medium">₹{taxes.toFixed(2)}</span>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-3 mt-2">
        <span className="font-semibold text-foreground text-lg">Total</span>
        <span className="font-bold text-foreground text-xl">₹{total.toFixed(2)}</span>
      </div>

      {/* Savings */}
      {discountAmount > 0 && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-3 mt-3">
          <div className="flex items-center gap-2 text-success">
            <Icon name="Sparkles" size={16} />
            <span className="text-sm font-medium">
              You're saving ₹{discountAmount.toFixed(2)} with {promoCode.code}!
            </span>
          </div>
        </div>
      )}

      {/* Free Delivery Notice */}
      {deliveryFee === 0 && subtotal >= 25 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mt-3">
          <div className="flex items-center gap-2 text-primary">
            <Icon name="Truck" size={16} />
            <span className="text-sm font-medium">
              Free delivery on orders ₹25+
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;