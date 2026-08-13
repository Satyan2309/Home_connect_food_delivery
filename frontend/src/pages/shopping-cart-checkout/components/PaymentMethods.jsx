import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import api from '../../../utils/api';

// Stripe library imports
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentMethods = ({ selectedMethod, onMethodSelect, savedCards, onAddCard }) => {
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    name: '',
    saveCard: false
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  
  // Use Stripe hooks
  const stripe = useStripe();
  const elements = useElements();
  
  // Fetch a payment intent from the backend
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await api.post('/api/payment/create-payment-intent', {
          amount: 1000, // Amount would be passed from parent component
          currency: 'usd'
        });
        
        setPaymentIntent(response.data);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      }
    };
    
    createPaymentIntent();
  }, []);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'CreditCard',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'Wallet',
      description: 'Pay with your PayPal account'
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      icon: 'Smartphone',
      description: 'Touch ID or Face ID'
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      icon: 'Smartphone',
      description: 'Pay with Google'
    },
    {
      id: 'cash',
      name: 'Cash on Delivery',
      icon: 'Banknote',
      description: 'Pay when your order arrives'
    }
  ];

  const handleInputChange = (field, value) => {
    setNewCard(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCardForm = () => {
    const newErrors = {};
    
    if (!stripe || !elements) {
      newErrors.stripe = 'Stripe has not been initialized';
      setErrors(newErrors);
      return false;
    }
    
    if (!newCard.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCard = async () => {
    if (validateCardForm()) {
      setIsProcessing(true);
      
      try {
        if (!stripe || !elements) {
          console.error('Stripe has not been initialized');
          return;
        }
        
        const cardElement = elements.getElement(CardElement);
        
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: newCard.name,
          },
        });
        
        if (error) {
          console.error('Error creating payment method:', error);
          setErrors({ stripe: error.message });
          setIsProcessing(false);
          return;
        }
        
        // If the user wants to save the card, send it to your backend
        if (newCard.saveCard) {
          await api.post('/api/payment/save-payment-method', {
            paymentMethodId: paymentMethod.id,
          });
        }
        
        const cardToAdd = {
          id: paymentMethod.id,
          last4: paymentMethod.card.last4,
          brand: paymentMethod.card.brand,
          expiry: `${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year.toString().slice(-2)}`,
          name: newCard.name
        };
        
        onAddCard(cardToAdd);
        setNewCard({
          name: '',
          saveCard: false
        });
        setShowNewCardForm(false);
      } catch (error) {
        console.error('Error processing card:', error);
        setErrors({ general: 'Failed to process card. Please try again.' });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Card brand is now provided by Stripe

  const getCardIcon = (brand) => {
    switch (brand) {
      case 'Visa': return 'CreditCard';
      case 'Mastercard': return 'CreditCard';
      case 'American Express': return 'CreditCard';
      default: return 'CreditCard';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
        <Icon name="CreditCard" size={20} />
        Payment Method
      </h3>

      {/* Payment Methods */}
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedMethod?.id === method.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
            onClick={() => onMethodSelect(method)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                selectedMethod?.id === method.id
                  ? 'border-primary bg-primary' :'border-muted-foreground'
              }`}>
                {selectedMethod?.id === method.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
              
              <Icon name={method.icon} size={20} className="text-muted-foreground" />
              
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{method.name}</h4>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Saved Cards */}
      {selectedMethod?.id === 'card' && savedCards.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Saved Cards</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewCardForm(!showNewCardForm)}
              iconName="Plus"
              iconPosition="left"
            >
              Add New
            </Button>
          </div>
          
          {savedCards.map((card) => (
            <div
              key={card.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedMethod?.cardId === card.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => onMethodSelect({ ...selectedMethod, cardId: card.id, card })}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedMethod?.cardId === card.id
                    ? 'border-primary bg-primary' :'border-muted-foreground'
                }`}>
                  {selectedMethod?.cardId === card.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
                
                <Icon name={getCardIcon(card.brand)} size={20} className="text-muted-foreground" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{card.brand}</span>
                    <span className="text-muted-foreground">•••• {card.last4}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expires {card.expiry}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Card Form */}
      {selectedMethod?.id === 'card' && showNewCardForm && (
        <div className="border border-border rounded-lg p-4 bg-muted/30">
          <h4 className="font-medium text-foreground mb-4">Add New Card</h4>
          
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">Card Details</label>
              <div className="border border-border rounded-md p-3 bg-background">
                <CardElement options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: 'var(--color-foreground)',
                      '::placeholder': {
                        color: 'var(--color-muted-foreground)',
                      },
                    },
                    invalid: {
                      color: 'var(--color-destructive)',
                    },
                  },
                }} />
              </div>
              {errors.stripe && <p className="text-destructive text-xs mt-1">{errors.stripe}</p>}
            </div>
            
            <Input
              label="Cardholder Name"
              type="text"
              placeholder="John Doe"
              value={newCard.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              required
            />
            
            <Checkbox
              label="Save this card for future purchases"
              checked={newCard.saveCard}
              onChange={(e) => handleInputChange('saveCard', e.target.checked)}
            />
            
            {errors.general && <p className="text-destructive text-xs">{errors.general}</p>}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="default"
              onClick={handleAddCard}
              iconName={isProcessing ? 'Loader' : 'Plus'}
              iconPosition="left"
              disabled={isProcessing}
              className={isProcessing ? 'opacity-70' : ''}
            >
              {isProcessing ? 'Processing...' : 'Add Card'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowNewCardForm(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Shield" size={20} className="text-success mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground text-sm">Secure Payment</h4>
            <p className="text-muted-foreground text-xs mt-1">
              Your payment information is encrypted and secure. We use Stripe for payment processing and never store your full card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap the component with Stripe Elements provider
const StripePaymentMethods = (props) => (
  <Elements stripe={stripePromise}>
    <PaymentMethods {...props} />
  </Elements>
);

export default StripePaymentMethods;