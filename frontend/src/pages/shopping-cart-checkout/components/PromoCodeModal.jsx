import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PromoCodeModal = ({ isOpen, onClose, onApplyPromo }) => {
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Mock available promo codes
  const availablePromoCodes = [
    {
      code: 'WELCOME10',
      discount: 10,
      description: 'Get 10% off your first order',
      minOrder: 20,
      isNew: true
    },
    {
      code: 'SAVE15',
      discount: 15,
      description: '15% off orders over ₹30',
      minOrder: 30,
      isNew: false
    },
    {
      code: 'FREESHIP',
      discount: 0,
      description: 'Free delivery on any order',
      minOrder: 0,
      freeDelivery: true,
      isNew: false
    }
  ];

  const handleApplyCode = async () => {
    if (!promoCode.trim()) {
      setError('Please enter a promo code');
      return;
    }

    setIsApplying(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const foundCode = availablePromoCodes.find(
        code => code.code.toLowerCase() === promoCode.toLowerCase()
      );

      if (foundCode) {
        onApplyPromo(foundCode);
        onClose();
      } else {
        setError('Invalid promo code. Please try again.');
      }
      
      setIsApplying(false);
    }, 1000);
  };

  const handleSelectCode = (code) => {
    setPromoCode(code.code);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md shadow-warm-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground text-lg flex items-center gap-2">
            <Icon name="Tag" size={20} />
            Apply Promo Code
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
            className="text-muted-foreground hover:text-foreground"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Promo Code Input */}
          <div>
            <Input
              label="Enter Promo Code"
              type="text"
              placeholder="e.g., WELCOME10"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase());
                setError('');
              }}
              error={error}
              className="mb-3"
            />
            
            <Button
              variant="default"
              onClick={handleApplyCode}
              loading={isApplying}
              iconName="Tag"
              iconPosition="left"
              fullWidth
            >
              {isApplying ? 'Applying...' : 'Apply Code'}
            </Button>
          </div>

          {/* Available Codes */}
          <div>
            <h3 className="font-medium text-foreground mb-3">Available Offers</h3>
            <div className="space-y-2">
              {availablePromoCodes.map((code) => (
                <div
                  key={code.code}
                  className="border border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => handleSelectCode(code)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-semibold text-primary">
                          {code.code}
                        </span>
                        {code.isNew && (
                          <span className="bg-success/10 text-success text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {code.description}
                      </p>
                      {code.minOrder > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Min. order: ₹{code.minOrder}
                        </p>
                      )}
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Promo codes cannot be combined. Only one code per order. 
                  Some restrictions may apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCodeModal;