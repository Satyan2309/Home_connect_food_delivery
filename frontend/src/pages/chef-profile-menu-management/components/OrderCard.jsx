import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrderCard = ({ order, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'accepted': return 'bg-primary text-primary-foreground';
      case 'preparing': return 'bg-accent text-accent-foreground';
      case 'ready': return 'bg-success text-success-foreground';
      case 'delivered': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'accepted';
      case 'accepted': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'delivered';
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'New Order';
      case 'accepted': return 'Accepted';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready for Pickup';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getActionText = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'Accept Order';
      case 'accepted': return 'Start Preparing';
      case 'preparing': return 'Mark Ready';
      case 'ready': return 'Mark Delivered';
      default: return null;
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsUpdating(true);
    await onUpdateStatus(order.id, newStatus);
    setIsUpdating(false);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              #{order.id.toString().slice(-4)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {order.customerName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.orderTime)} at {formatTime(order.orderTime)}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">
                {item.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity} × ₹{item.price}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">
                ₹{(item.quantity * item.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <Icon name="MessageSquare" size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Special Instructions:
              </p>
              <p className="text-sm text-muted-foreground">
                {order.specialInstructions}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Customer Contact */}
      <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Phone" size={16} className="text-muted-foreground" />
          <span className="text-sm text-foreground">{order.customerPhone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="MapPin" size={16} className="text-muted-foreground" />
          <span className="text-sm text-foreground truncate max-w-32">
            {order.deliveryAddress}
          </span>
        </div>
      </div>

      {/* Order Total */}
      <div className="flex items-center justify-between mb-4 pt-3 border-t border-border">
        <span className="font-semibold text-foreground">Total Amount:</span>
        <span className="text-xl font-bold text-primary">
          ₹{order.totalAmount.toFixed(2)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        {nextStatus && (
          <Button
            onClick={() => handleStatusUpdate(nextStatus)}
            loading={isUpdating}
            className="flex-1"
            iconName={
              nextStatus === 'accepted' ? 'Check' :
              nextStatus === 'preparing' ? 'ChefHat' :
              nextStatus === 'ready'? 'Clock' : 'Truck'
            }
            iconPosition="left"
          >
            {getActionText(order.status)}
          </Button>
        )}
        
        {order.status === 'pending' && (
          <Button
            variant="destructive"
            onClick={() => handleStatusUpdate('cancelled')}
            loading={isUpdating}
            iconName="X"
            iconPosition="left"
          >
            Decline
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => window.open(`tel:${order.customerPhone}`)}
          iconName="Phone"
          size="sm"
        />
      </div>

      {/* Estimated Time */}
      {(order.status === 'accepted' || order.status === 'preparing') && (
        <div className="mt-3 p-2 bg-accent/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} className="text-accent" />
            <span className="text-sm text-accent font-medium">
              Est. ready in {order.estimatedTime} minutes
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;