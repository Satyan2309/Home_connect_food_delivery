import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderConfirmation = ({ orderDetails, onClose }) => {
  const estimatedDeliveryTime = new Date(Date.now() + 45 * 60000); // 45 minutes from now

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-warm-lg">
        {/* Success Animation */}
        <div className="text-center p-6 border-b border-border">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h2 className="font-bold text-foreground text-xl mb-2">
            Order Confirmed!
          </h2>
          <p className="text-muted-foreground">
            Your order has been placed successfully
          </p>
        </div>

        {/* Order Details */}
        <div className="p-6 space-y-4">
          {/* Order Number */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-mono font-semibold text-foreground text-lg">
                  #{orderDetails.orderNumber}
                </p>
              </div>
              <Icon name="Receipt" size={24} className="text-primary" />
            </div>
          </div>

          {/* Delivery Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon name="Clock" size={20} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">
                  {estimatedDeliveryTime.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                  })} ({orderDetails.deliverySlot?.time || 'ASAP'})
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Icon name="MapPin" size={20} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Delivery Address</p>
                <p className="text-sm text-muted-foreground">
                  {orderDetails.deliveryAddress?.fullAddress}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Icon name="DollarSign" size={20} className="text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Total Amount</p>
                <p className="text-sm text-muted-foreground">
                  ₹{orderDetails.total?.toFixed(2)} via {orderDetails.paymentMethod?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Chef Information */}
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Icon name="ChefHat" size={16} />
              Your Chef{orderDetails.items?.length > 1 ? 's' : ''}
            </h4>
            <div className="space-y-2">
              {orderDetails.chefs?.map((chef, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={14} className="text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{chef.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Bell" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-1">What's Next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll receive SMS updates on your order status</li>
                  <li>• Chef will start preparing your meal shortly</li>
                  <li>• Track your order in real-time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border space-y-3">
          <Link to="/order-tracking-history" className="block">
            <Button
              variant="default"
              fullWidth
              iconName="Eye"
              iconPosition="left"
            >
              Track Your Order
            </Button>
          </Link>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/meal-discovery-browse">
              <Button
                variant="outline"
                fullWidth
                iconName="Search"
                iconPosition="left"
              >
                Browse More
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;