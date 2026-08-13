import React from 'react';
import Icon from '../../../components/AppIcon';

const CheckoutSteps = ({ currentStep, onStepClick }) => {
  const steps = [
    {
      id: 'cart',
      title: 'Cart Review',
      icon: 'ShoppingCart',
      description: 'Review your items'
    },
    {
      id: 'delivery',
      title: 'Delivery Details',
      icon: 'MapPin',
      description: 'Address & time'
    },
    {
      id: 'payment',
      title: 'Payment',
      icon: 'CreditCard',
      description: 'Complete order'
    }
  ];

  const getStepStatus = (stepId) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-warm-sm mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable = status === 'completed' || status === 'current';
          
          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-center gap-3 ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={() => isClickable && onStepClick(step.id)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    status === 'completed'
                      ? 'bg-success border-success text-success-foreground'
                      : status === 'current' ?'bg-primary border-primary text-primary-foreground' :'bg-muted border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {status === 'completed' ? (
                    <Icon name="Check" size={20} />
                  ) : (
                    <Icon name={step.icon} size={20} />
                  )}
                </div>
                
                <div className="hidden sm:block">
                  <h3
                    className={`font-medium text-sm ${
                      status === 'current' ?'text-foreground'
                        : status === 'completed' ?'text-success' :'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    getStepStatus(steps[index + 1].id) === 'completed' ||
                    (getStepStatus(steps[index + 1].id) === 'current' && status === 'completed')
                      ? 'bg-success' :'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Mobile Step Titles */}
      <div className="sm:hidden mt-3 text-center">
        <h3 className="font-medium text-foreground">
          {steps.find(s => s.id === currentStep)?.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {steps.find(s => s.id === currentStep)?.description}
        </p>
      </div>
    </div>
  );
};

export default CheckoutSteps;