import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-hot-toast';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import cartService from '../../utils/cartService';

// Import components
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import DeliveryAddressForm from './components/DeliveryAddressForm';
import DeliveryTimeSlots from './components/DeliveryTimeSlots';
import PaymentMethods from './components/PaymentMethods';
import CheckoutSteps from './components/CheckoutSteps';
import PromoCodeModal from './components/PromoCodeModal';
import OrderConfirmation from './components/OrderConfirmation';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ShoppingCartCheckout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('cart');
  const [isLoading, setIsLoading] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState(null);

  // Delivery state
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [contactPhone, setContactPhone] = useState('');

  // Payment state
  const [savedCards, setSavedCards] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Order state
  const [orderDetails, setOrderDetails] = useState(null);

  // Real data initialization
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        // Fetch real cart data from the API
        const cartData = await cartService.getCart();
        setCartItems(cartData.items);
        setPromoCode(cartData.promoCode);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch cart data:', error);
        toast.error('Failed to load your cart. Please try again.');
        setIsLoading(false);
      }
    };

    // Fetch user addresses (mock for now, would be from userService in real app)
    const fetchUserData = () => {
      // Mock saved addresses
      const mockAddresses = [
        {
          id: '1',
          type: 'home',
          street: '123 Oak Street',
          apartment: 'Apt 4B',
          city: 'Delhi',
          state: 'CA',
          zipCode: '94102',
          fullAddress: '123 Oak Street, Apt 4B, delhi, CA 94102',
          instructions: 'Ring doorbell twice',
          isDefault: true
        },
        {
          id: '2',
          type: 'work',
          street: '456 Market Street',
          apartment: 'Suite 200',
          city: 'Delhi',
          state: 'CA',
          zipCode: '94105',
          fullAddress: 'Delhi,India',
          instructions: 'Leave with reception',
          isDefault: false
        }
      ];

      // Mock saved cards
      const mockCards = [
        {
          id: '1',
          brand: 'Visa',
          last4: '4242',
          expiry: '12/26',
          name: 'John Doe'
        },
        {
          id: '2',
          brand: 'Mastercard',
          last4: '8888',
          expiry: '08/25',
          name: 'John Doe'
        }
      ];

      setSavedAddresses(mockAddresses);
      setSelectedAddress(mockAddresses[0]);
      setSavedCards(mockCards);
      setContactPhone('+1 (555) 123-4567');
    };

    fetchCartData();
    fetchUserData();
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = selectedTimeSlot?.id === 'asap' ? 4.99 : selectedTimeSlot?.price || 2.99;
  const actualDeliveryFee = subtotal >= 25 ? 0 : deliveryFee;
  const taxes = subtotal * 0.0875; // 8.75% tax
  const promoDiscount = promoCode ? (subtotal * (promoCode.discount / 100)) : 0;
  const total = subtotal - promoDiscount + actualDeliveryFee + taxes;

  // Cart handlers
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      setIsLoading(true);
      await cartService.updateCartItem({
        cartItemId: itemId,
        quantity: newQuantity
      });
      
      // Refresh cart data
      const cartData = await cartService.getCart();
      setCartItems(cartData.items);
      setPromoCode(cartData.promoCode);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to update cart item:', error);
      toast.error('Failed to update item quantity. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setIsLoading(true);
      await cartService.removeFromCart(itemId);
      
      // Refresh cart data
      const cartData = await cartService.getCart();
      setCartItems(cartData.items);
      setPromoCode(cartData.promoCode);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      toast.error('Failed to remove item from cart. Please try again.');
      setIsLoading(false);
    }
  };

  const handleUpdateInstructions = async (itemId, instructions) => {
    try {
      setIsLoading(true);
      // Get the current item to preserve its quantity
      const currentItem = cartItems.find(item => item.id === itemId);
      if (!currentItem) return;
      
      await cartService.updateCartItem({
        cartItemId: itemId,
        quantity: currentItem.quantity,
        specialInstructions: instructions
      });
      
      // Refresh cart data
      const cartData = await cartService.getCart();
      setCartItems(cartData.items);
      setPromoCode(cartData.promoCode);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to update special instructions:', error);
      toast.error('Failed to update special instructions. Please try again.');
      setIsLoading(false);
    }
  };

  // Clear cart handler
  const handleClearCart = async () => {
    try {
      setIsLoading(true);
      await cartService.clearCart();
      
      // Refresh cart data
      const cartData = await cartService.getCart();
      setCartItems(cartData.items);
      setPromoCode(null);
      toast.success('Cart cleared successfully!');
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error('Failed to clear cart. Please try again.');
      setIsLoading(false);
    }
  };

  // Address handlers
  const handleAddAddress = (newAddress) => {
    setSavedAddresses(addresses => [...addresses, newAddress]);
    setSelectedAddress(newAddress);
  };

  // Payment handlers
  const handleAddCard = (newCard) => {
    setSavedCards(cards => [...cards, newCard]);
    setSelectedPaymentMethod({
      id: 'card',
      name: 'Credit/Debit Card',
      cardId: newCard.id,
      card: newCard
    });
  };

  // Promo code handlers
  const handleApplyPromo = async (code) => {
    try {
      setIsLoading(true);
      await cartService.applyPromoCode(code);
      
      // Refresh cart data
      const cartData = await cartService.getCart();
      setCartItems(cartData.items);
      setPromoCode(cartData.promoCode);
      setShowPromoModal(false);
      toast.success('Promo code applied successfully!');
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to apply promo code:', error);
      toast.error(error.toString() || 'Failed to apply promo code. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRemovePromo = async () => {
    try {
      setIsLoading(true);
      await cartService.removePromoCode();
      
      // Refresh cart data
      const cartData = await cartService.getCart();
      setCartItems(cartData.items);
      setPromoCode(null);
      toast.success('Promo code removed successfully!');
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to remove promo code:', error);
      toast.error('Failed to remove promo code. Please try again.');
      setIsLoading(false);
    }
  };

  // Step navigation
  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const handleContinue = () => {
    if (currentStep === 'cart') {
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      handlePlaceOrder();
    }
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery') {
      setCurrentStep('cart');
    }
  };

  // Order placement
  const handlePlaceOrder = async () => {
    setIsLoading(true);

    try {
      // Create order data
      const orderData = {
        deliveryAddress: selectedAddress.id,
        deliveryTime: selectedTimeSlot.id,
        contactPhone: contactPhone,
        paymentMethod: selectedPaymentMethod.id,
        paymentDetails: selectedPaymentMethod.cardId ? {
          cardId: selectedPaymentMethod.cardId
        } : {}
      };

      // In a real implementation, this would call the order service
      // const response = await orderService.createOrder(orderData);
      
      // For now, simulate order creation
      const orderNumber = `HC${Date.now().toString().slice(-6)}`;
      const uniqueChefs = [...new Set(cartItems.map(item => item.chefName))];
      
      // Simulate API response
      const orderResponse = {
        orderNumber,
        items: cartItems,
        deliveryAddress: selectedAddress,
        deliverySlot: selectedTimeSlot,
        paymentMethod: selectedPaymentMethod,
        total,
        chefs: uniqueChefs.map(name => ({ name }))
      };
      
      setOrderDetails(orderResponse);
      
      // Clear the cart after successful order
      await cartService.clearCart();
      
      setIsLoading(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place your order. Please try again.');
      setIsLoading(false);
    }
  };

  // Validation
  const canContinue = () => {
    if (currentStep === 'cart') {
      return cartItems.length > 0;
    } else if (currentStep === 'delivery') {
      return selectedAddress && selectedTimeSlot && contactPhone;
    } else if (currentStep === 'payment') {
      return selectedPaymentMethod;
    }
    return false;
  };

  // Empty cart check
  if (cartItems.length === 0 && currentStep === 'cart') {
    return (
      <>
        <Helmet>
          <title>Shopping Cart - HomeCook Connect</title>
          <meta name="description" content="Review and checkout your homemade meal orders" />
        </Helmet>
        
        <div className="min-h-screen bg-background">
          <Header />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="ShoppingCart" size={48} className="text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground mb-8">
                Discover amazing homemade meals from local chefs
              </p>
              <Link to="/meal-discovery-browse">
                <Button variant="default" iconName="Search" iconPosition="left">
                  Browse Meals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - HomeCook Connect</title>
        <meta name="description" content="Complete your order for fresh homemade meals" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Link to="/meal-discovery-browse" className="hover:text-foreground transition-colors">
                Browse
              </Link>
              <Icon name="ChevronRight" size={16} />
              <span>Checkout</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <CheckoutSteps currentStep={currentStep} onStepClick={handleStepClick} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Review Step */}
              {currentStep === 'cart' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Icon name="ShoppingCart" size={24} />
                    Review Your Order ({cartItems.length} items)
                  </h2>
                  
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                      onUpdateInstructions={handleUpdateInstructions}
                    />
                  ))}
                </div>
              )}

              {/* Delivery Details Step */}
              {currentStep === 'delivery' && (
                <div className="space-y-6">
                  <DeliveryAddressForm
                    savedAddresses={savedAddresses}
                    selectedAddress={selectedAddress}
                    onAddressSelect={setSelectedAddress}
                    onAddAddress={handleAddAddress}
                  />
                  
                  <DeliveryTimeSlots
                    selectedSlot={selectedTimeSlot}
                    onSlotSelect={setSelectedTimeSlot}
                  />
                  
                  <div>
                    <Input
                      label="Contact Phone Number"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      description="We'll use this to coordinate delivery"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <div className="space-y-6">
                  <Elements stripe={stripePromise}>
                    <PaymentMethods
                      selectedMethod={selectedPaymentMethod}
                      onMethodSelect={setSelectedPaymentMethod}
                      savedCards={savedCards}
                      onAddCard={handleAddCard}
                    />
                  </Elements>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary
                items={cartItems}
                deliveryFee={actualDeliveryFee}
                taxes={taxes}
                promoCode={promoCode}
                onApplyPromo={() => setShowPromoModal(true)}
                onRemovePromo={handleRemovePromo}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8 pt-6 border-t border-border">
            <div>
              {currentStep !== 'cart' && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  iconName="ChevronLeft"
                  iconPosition="left"
                >
                  Back
                </Button>
              )}
              {currentStep === 'cart' && cartItems.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearCart}
                  iconName="Trash2"
                  iconPosition="left"
                  className="text-error hover:text-error"
                  disabled={isLoading}
                >
                  Clear Cart
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Link to="/meal-discovery-browse">
                <Button variant="ghost">
                  Continue Shopping
                </Button>
              </Link>
              
              <Button
                variant="default"
                onClick={handleContinue}
                disabled={!canContinue()}
                loading={isLoading}
                iconName={currentStep === 'payment' ? 'CreditCard' : 'ChevronRight'}
                iconPosition="right"
                className="min-w-[140px]"
              >
                {currentStep === 'cart' && 'Continue'}
                {currentStep === 'delivery' && 'Continue'}
                {currentStep === 'payment' && (isLoading ? 'Processing...' : `Pay ₹${total.toFixed(2)}`)}
              </Button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <PromoCodeModal
          isOpen={showPromoModal}
          onClose={() => setShowPromoModal(false)}
          onApplyPromo={handleApplyPromo}
        />

        {showConfirmation && (
          <OrderConfirmation
            orderDetails={orderDetails}
            onClose={() => {
              setShowConfirmation(false);
              navigate('/order-tracking-history');
            }}
          />
        )}
      </div>
    </>
  );
};

export default ShoppingCartCheckout;