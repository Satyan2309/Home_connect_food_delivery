import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const OrderDetailsModal = ({ order, isOpen, onClose, onReorder, onWriteReview }) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  const calculateSubtotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name="Star"
            size={16}
            className={star <= rating ? 'text-warning fill-current' : 'text-muted-foreground'}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-warm-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Order Details
            </h2>
            <p className="text-muted-foreground">Order #{order.id}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground mb-1">Order Status</h3>
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                <Icon name="CheckCircle" size={16} />
                <span className="capitalize">{order.status}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium text-foreground">{formatDate(order.orderDate)}</p>
              <p className="text-sm text-muted-foreground">{formatTime(order.orderDate)}</p>
            </div>
          </div>

          {/* Chef Information */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Chef Information</h3>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={order.chef.avatar}
                  alt={order.chef.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{order.chef.name}</h4>
                <p className="text-sm text-muted-foreground">{order.chef.speciality}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm text-muted-foreground">{order.chef.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{order.chef.distance}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium text-foreground mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </span>
                      <span className="font-medium text-foreground">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-foreground">₹{order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Service Fee</span>
                <span className="text-foreground">₹{order.serviceFee.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-success">-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between font-medium">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Delivery Information</h3>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Icon name="MapPin" size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Delivery Address</p>
                  <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                </div>
              </div>
              {order.deliveryTime && (
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Delivered At</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.deliveryTime)} at {formatTime(order.deliveryTime)}
                    </p>
                  </div>
                </div>
              )}
              {order.specialInstructions && (
                <div className="flex items-start space-x-2">
                  <Icon name="MessageSquare" size={16} className="text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Special Instructions</p>
                    <p className="text-sm text-muted-foreground">{order.specialInstructions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rating & Review */}
          {order.rating && (
            <div>
              <h3 className="font-medium text-foreground mb-3">Your Review</h3>
              <div className="bg-muted/30 rounded-lg p-4">
                {renderRating(order.rating)}
                {order.review && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    "{order.review}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Delivery Photos */}
          {order.deliveryPhotos && order.deliveryPhotos.length > 0 && (
            <div>
              <h3 className="font-medium text-foreground mb-3">Delivery Photos</h3>
              <div className="grid grid-cols-2 gap-3">
                {order.deliveryPhotos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={photo}
                      alt={`Delivery photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-border">
          {order.status === 'delivered' && (
            <>
              <Button
                variant="default"
                onClick={() => onReorder(order)}
                iconName="RotateCcw"
                iconPosition="left"
                className="flex-1"
              >
                Reorder
              </Button>
              {!order.rating && (
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
            </>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;