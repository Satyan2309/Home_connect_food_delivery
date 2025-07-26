import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ReviewModal = ({ order, isOpen, onClose, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [deliveryHoverRating, setDeliveryHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmitReview({
        orderId: order.id,
        rating,
        review,
        deliveryRating
      });
      onClose();
      // Reset form
      setRating(0);
      setReview('');
      setDeliveryRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (currentRating, hoverRating, onRate, onHover, onLeave) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={onLeave}
            className="p-1 transition-colors hover:scale-110 transform"
          >
            <Icon
              name="Star"
              size={24}
              className={
                star <= (hoverRating || currentRating)
                  ? 'text-warning fill-current' :'text-muted-foreground hover:text-warning'
              }
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Select Rating';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-warm-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Rate Your Order
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Chef Information */}
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={order.chef.avatar}
                alt={order.chef.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{order.chef.name}</h3>
              <p className="text-sm text-muted-foreground">{order.chef.speciality}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Icon name="Star" size={14} className="text-warning fill-current" />
                <span className="text-sm text-muted-foreground">{order.chef.rating}</span>
              </div>
            </div>
          </div>

          {/* Food Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              How was the food quality?
            </label>
            <div className="flex items-center space-x-4">
              {renderStarRating(
                rating,
                hoverRating,
                setRating,
                setHoverRating,
                () => setHoverRating(0)
              )}
              <span className="text-sm text-muted-foreground">
                {getRatingText(hoverRating || rating)}
              </span>
            </div>
          </div>

          {/* Delivery Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              How was the delivery experience?
            </label>
            <div className="flex items-center space-x-4">
              {renderStarRating(
                deliveryRating,
                deliveryHoverRating,
                setDeliveryRating,
                setDeliveryHoverRating,
                () => setDeliveryHoverRating(0)
              )}
              <span className="text-sm text-muted-foreground">
                {getRatingText(deliveryHoverRating || deliveryRating)}
              </span>
            </div>
          </div>

          {/* Written Review */}
          <div>
            <Input
              label="Write a review (optional)"
              type="text"
              placeholder="Share your experience with this meal..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              description="Help other customers by sharing your honest feedback"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Order Items Preview */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Items in this order:</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <div className="w-8 h-8 rounded overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-foreground">{item.quantity}x {item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              disabled={rating === 0}
              iconName="Star"
              iconPosition="left"
              className="flex-1"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;