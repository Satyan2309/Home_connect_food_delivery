import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import mealService from 'utils/mealService';
import cartService from 'utils/cartService';
import { toast } from 'react-hot-toast';
import { formatCurrency } from 'utils/formatters';

// Components
import Image from 'components/AppImage';
import Icon from 'components/AppIcon';
import Button from 'components/ui/Button';
import Spinner from 'components/Spinner';
import QuantitySelector from 'components/QuantitySelector';

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        setLoading(true);
        const data = await mealService.getMealById(id);
        setMeal(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch meal details:', err);
        setError('Failed to load meal details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMealDetails();
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login page if user is not authenticated
      toast.error('Please log in to add items to your cart');
      navigate('/user-registration-login', { state: { from: `/meal-details/${id}` } });
      return;
    }

    try {
      setAddingToCart(true);
      await cartService.addToCart({
        mealId: id,
        quantity: quantity,
      });
      toast.success('Added to cart successfully!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={32} className="text-error" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {error || 'Meal not found'}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find the meal you're looking for. It may have been removed or is no longer available.
          </p>
          <Button onClick={() => navigate('/meal-discovery-browse')}>
            Browse Other Meals
          </Button>
        </div>
      </div>
    );
  }

  // Format delivery time color based on duration
  const getDeliveryTimeColor = (minutes) => {
    if (minutes <= 30) return 'text-success';
    if (minutes <= 45) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="rounded-xl overflow-hidden">
          <Image 
            src={meal.image} 
            alt={meal.name} 
            className="w-full h-auto object-cover aspect-[4/3]" 
          />
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Chef Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={meal.chef.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'}
                alt={meal.chef.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{meal.chef.fullName}</h3>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-warning fill-current" />
                <span className="text-sm">
                  {meal.chef.rating || 4.5}
                </span>
              </div>
            </div>
          </div>

          {/* Meal Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{meal.name}</h1>

          {/* Price and Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xl font-bold text-foreground">
              {formatCurrency(meal.price)}
              {meal.originalPrice && (
                <span className="text-sm font-normal text-muted-foreground line-through ml-2">
                  {formatCurrency(meal.originalPrice)}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {meal.dietaryTags && meal.dietaryTags.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{meal.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
            <div>
              <p className="text-sm text-muted-foreground">Prep Time</p>
              <p className="font-medium">{meal.prepTime} mins</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Serves</p>
              <p className="font-medium">{meal.serves} people</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Delivery</p>
              <p className={`font-medium ${getDeliveryTimeColor(meal.prepTime + 15)}`}>
                {meal.prepTime + 15} mins
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="font-medium">{meal.quantity} left</p>
            </div>
          </div>

          {/* Ingredients */}
          {meal.ingredients && meal.ingredients.length > 0 && (
            <div>
              <h3 className="font-medium text-foreground mb-2">Ingredients</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {meal.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart Section */}
          <div className="flex items-center space-x-4 pt-4">
            <QuantitySelector
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={meal.quantity}
              disabled={!meal.isAvailable || meal.quantity <= 0}
            />
            <Button 
              variant="primary" 
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!meal.isAvailable || meal.quantity <= 0 || addingToCart}
            >
              {addingToCart ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Adding...
                </>
              ) : (
                'Add to Cart'
              )}
            </Button>
          </div>

          {/* Availability Notice */}
          {(!meal.isAvailable || meal.quantity <= 0) && (
            <div className="text-error text-sm">
              This meal is currently unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealDetails;