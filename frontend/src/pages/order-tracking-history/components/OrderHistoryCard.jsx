import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const OrderHistoryCard = ({ order, onReorder, onViewDetails, onWriteReview }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-success bg-success/10';
      case 'cancelled':
        return 'text-error bg-error/10';
      case 'refunded':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return 'CheckCircle';
      case 'cancelled':
        return 'XCircle';
      case 'refunded':
        return 'RotateCcw';
      default:
        return 'Clock';
    }
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="Star"
            size={14}
            className={star <= rating ? 'text-warning fill-current' : 'text-muted-foreground'}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-warm-sm p-6 mb-4 hover:shadow-warm transition-shadow">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={order.chef.avatar}
              alt={order.chef.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              Order #{order.id}
            </h3>
            <p className="text-muted-foreground text-sm">
              From {order.chef.name}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatDate(order.orderDate)} at {formatTime(order.orderDate)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            <Icon name={getStatusIcon(order.status)} size={12} />
            <span className="capitalize">{order.status}</span>
          </div>
          <p className="font-semibold text-lg text-foreground mt-1">
            ₹{order.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <div className="space-y-2">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-foreground font-medium">{item.name}</span>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="text-muted-foreground">₹{item.price.toFixed(2)}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-sm text-muted-foreground pl-13">
              +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Rating Display */}
      {order.rating && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Your Rating:</span>
            {renderRating(order.rating)}
          </div>
          {order.review && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              "{order.review}"
            </p>
          )}
        </div>
      )}

      {/* Delivery Info */}
      <div className="mb-4 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Icon name="MapPin" size={14} />
          <span>Delivered to {order.deliveryAddress}</span>
        </div>
        {order.deliveryTime && (
          <div className="flex items-center space-x-2 mt-1">
            <Icon name="Clock" size={14} />
            <span>Delivered at {formatTime(order.deliveryTime)}</span>
          </div>
        )}
      </div>

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
        
        {order.status === 'delivered' && (
          <Button
            variant="default"
            onClick={() => onReorder(order)}
            iconName="RotateCcw"
            iconPosition="left"
            className="flex-1"
          >
            Reorder
          </Button>
        )}
        
        {order.status === 'delivered' && !order.rating && (
          <Button
            variant="outline"
            onClick={() => onWriteReview(order)}
            iconName="Star"
            iconPosition="left"
            className="flex-1"
          >
            Write Review
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryCard;