import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ActiveOrderCard = ({ order, onViewDetails, onContactChef }) => {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [estimatedTime, setEstimatedTime] = useState(order.estimatedDeliveryTime);

  const statusSteps = [
    { key: 'confirmed', label: 'Confirmed', icon: 'CheckCircle' },
    { key: 'preparing', label: 'Preparing', icon: 'ChefHat' },
    { key: 'ready', label: 'Ready', icon: 'Clock' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: 'Truck' },
    { key: 'delivered', label: 'Delivered', icon: 'Package' }
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === currentStatus);
  };

  const getStatusColor = (stepIndex) => {
    const currentIndex = getCurrentStepIndex();
    if (stepIndex <= currentIndex) {
      return 'text-primary bg-primary/10';
    }
    return 'text-muted-foreground bg-muted';
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (currentStatus !== 'delivered') {
        // Simulate status progression for demo
        const random = Math.random();
        if (random < 0.1) { // 10% chance to update status
          const currentIndex = getCurrentStepIndex();
          if (currentIndex < statusSteps.length - 1) {
            setCurrentStatus(statusSteps[currentIndex + 1].key);
            // Update estimated time
            const newTime = new Date(Date.now() + Math.random() * 30 * 60000);
            setEstimatedTime(newTime.toISOString());
          }
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [currentStatus]);

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm p-6 mb-4">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={order.chef.avatar}
              alt={order.chef.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Order #{order.id}
            </h3>
            <p className="text-muted-foreground text-sm">
              From {order.chef.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Ordered at {formatTime(order.orderTime)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg text-foreground">
            ₹{order.total.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.items.length} item{order.items.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">Order Status</h4>
          {currentStatus !== 'delivered' && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Icon name="Clock" size={16} />
              <span>ETA: {formatTime(estimatedTime)}</span>
            </div>
          )}
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${getStatusColor(index)}`}>
                  <Icon name={step.icon} size={20} />
                </div>
                <span className={`text-xs mt-2 text-center ${index <= getCurrentStepIndex() ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          
          {/* Progress Line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted -z-10">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-3">Order Items</h4>
        <div className="space-y-2">
          {order.items.slice(0, 2).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{item.quantity}x {item.name}</span>
              <span className="text-muted-foreground">₹{item.price.toFixed(2)}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <p className="text-sm text-muted-foreground">
              +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-6">
        <h4 className="font-medium text-foreground mb-2">Delivery Address</h4>
        <div className="flex items-start space-x-2 text-sm text-muted-foreground">
          <Icon name="MapPin" size={16} className="mt-0.5 flex-shrink-0" />
          <span>{order.deliveryAddress}</span>
        </div>
      </div>

      {/* Live Tracking Map (when out for delivery) */}
      {currentStatus === 'out_for_delivery' && (
        <div className="mb-6">
          <h4 className="font-medium text-foreground mb-3">Live Tracking</h4>
          <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Delivery Tracking"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${order.chef.location.lat},${order.chef.location.lng}&z=14&output=embed`}
              className="border-0"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={() => onViewDetails(order)}
          iconName="Eye"
          iconPosition="left"
          className="flex-1"
        >
          View Details
        </Button>
        <Button
          variant="outline"
          onClick={() => onContactChef(order.chef)}
          iconName="MessageCircle"
          iconPosition="left"
          className="flex-1"
        >
          Contact Chef
        </Button>
        {currentStatus === 'delivered' && (
          <Button
            variant="default"
            iconName="Star"
            iconPosition="left"
            className="flex-1"
          >
            Rate Order
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActiveOrderCard;