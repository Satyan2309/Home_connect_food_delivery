import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentMethodsSection = ({ paymentMethods, onUpdatePaymentMethods }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCard, setNewCard] = useState({
    type: 'credit',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    isDefault: false
  });
  const [errors, setErrors] = useState({});

  const cardTypes = [
    { value: 'credit', label: 'Credit Card' },
    { value: 'debit', label: 'Debit Card' }
  ];

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i)
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return; // Max 16 digits + 3 spaces
    }

    // Limit CVV to 4 digits
    if (name === 'cvv' && value.length > 4) return;

    setNewCard(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateCard = () => {
    const newErrors = {};
    
    if (!newCard.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    const cardNumberDigits = newCard.cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!newCard.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    }
    
    if (!newCard.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    }
    
    if (!newCard.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (newCard.cvv.length < 3) {
      newErrors.cvv = 'CVV must be at least 3 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveCard = () => {
    if (validateCard()) {
      const cardToSave = {
        ...newCard,
        id: Date.now().toString(),
        lastFour: newCard.cardNumber.replace(/\s/g, '').slice(-4),
        brand: detectCardBrand(newCard.cardNumber.replace(/\s/g, ''))
      };
      
      onUpdatePaymentMethods([...paymentMethods, cardToSave]);
      setIsAddingNew(false);
      setNewCard({
        type: 'credit',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: '',
        isDefault: false
      });
      setErrors({});
    }
  };

  const detectCardBrand = (cardNumber) => {
    const firstDigit = cardNumber.charAt(0);
    const firstTwo = cardNumber.substring(0, 2);
    
    if (firstDigit === '4') return 'visa';
    if (firstTwo >= '51' && firstTwo <= '55') return 'mastercard';
    if (firstTwo === '34' || firstTwo === '37') return 'amex';
    if (firstTwo === '60' || firstTwo === '65') return 'discover';
    return 'unknown';
  };

  const getCardIcon = (brand) => {
    switch (brand) {
      case 'visa': return 'CreditCard';
      case 'mastercard': return 'CreditCard';
      case 'amex': return 'CreditCard';
      case 'discover': return 'CreditCard';
      default: return 'CreditCard';
    }
  };

  const handleDeleteCard = (cardId) => {
    const updatedCards = paymentMethods.filter(card => card.id !== cardId);
    onUpdatePaymentMethods(updatedCards);
  };

  const handleSetDefault = (cardId) => {
    const updatedCards = paymentMethods.map(card => ({
      ...card,
      isDefault: card.id === cardId
    }));
    onUpdatePaymentMethods(updatedCards);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setNewCard({
      type: 'credit',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      isDefault: false
    });
    setErrors({});
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-warm-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Payment Methods</h2>
        {!isAddingNew && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNew(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Card
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Existing Cards */}
        {paymentMethods.map((card) => (
          <div
            key={card.id}
            className="border border-border rounded-lg p-4 hover:shadow-warm-sm transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                  <Icon name={getCardIcon(card.brand)} size={20} className="text-muted-foreground" />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">
                      •••• •••• •••• {card.lastFour}
                    </span>
                    {card.isDefault && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {card.cardholderName} • Expires {card.expiryMonth}/{card.expiryYear}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!card.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(card.id)}
                    className="text-xs"
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteCard(card.id)}
                  iconName="Trash2"
                  className="text-error hover:text-error"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card Form */}
        {isAddingNew && (
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Add New Card</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveCard}
                >
                  Save Card
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Select
                label="Card Type"
                options={cardTypes}
                value={newCard.type}
                onChange={(value) => setNewCard(prev => ({ ...prev, type: value }))}
              />

              <Input
                label="Cardholder Name"
                name="cardholderName"
                type="text"
                value={newCard.cardholderName}
                onChange={handleInputChange}
                error={errors.cardholderName}
                required
                placeholder="Name as it appears on card"
              />

              <Input
                label="Card Number"
                name="cardNumber"
                type="text"
                value={newCard.cardNumber}
                onChange={handleInputChange}
                error={errors.cardNumber}
                required
                placeholder="1234 5678 9012 3456"
              />

              <div className="grid grid-cols-3 gap-4">
                <Select
                  label="Expiry Month"
                  options={months}
                  value={newCard.expiryMonth}
                  onChange={(value) => setNewCard(prev => ({ ...prev, expiryMonth: value }))}
                  error={errors.expiryMonth}
                  required
                  placeholder="MM"
                />
                
                <Select
                  label="Expiry Year"
                  options={years}
                  value={newCard.expiryYear}
                  onChange={(value) => setNewCard(prev => ({ ...prev, expiryYear: value }))}
                  error={errors.expiryYear}
                  required
                  placeholder="YYYY"
                />
                
                <Input
                  label="CVV"
                  name="cvv"
                  type="password"
                  value={newCard.cvv}
                  onChange={handleInputChange}
                  error={errors.cvv}
                  required
                  placeholder="123"
                  maxLength={4}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-3 flex items-start space-x-3">
                <Icon name="Shield" size={16} className="text-success mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Secure Payment</p>
                  <p className="text-muted-foreground">
                    Your payment information is encrypted and secure. We never store your CVV.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentMethods.length === 0 && !isAddingNew && (
          <div className="text-center py-8">
            <Icon name="CreditCard" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No payment methods</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a payment method to make checkout faster
            </p>
            <Button
              variant="default"
              onClick={() => setIsAddingNew(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Add Your First Card
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsSection;