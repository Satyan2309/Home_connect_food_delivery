import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const WelcomePanel = ({ activeTab }) => {
  const features = [
    {
      icon: 'ChefHat',
      title: 'Authentic Home Cooking',
      description: 'Discover delicious homemade meals from talented home chefs in your neighborhood'
    },
    {
      icon: 'MapPin',
      title: 'Hyperlocal Delivery',
      description: 'Fresh meals delivered from nearby kitchens, ensuring quality and quick delivery'
    },
    {
      icon: 'Star',
      title: 'Trusted Community',
      description: 'Verified home chefs with ratings and reviews from satisfied customers'
    },
    {
      icon: 'Clock',
      title: 'Real-time Tracking',
      description: 'Track your order from preparation to delivery with live updates'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Customer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      quote: 'The best homemade Indian food I\'ve had outside of my grandmother\'s kitchen!'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Home Chef',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      quote: 'HomeCook Connect helped me turn my passion for cooking into a thriving business.'
    }
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 to-secondary/5 p-8 flex-col justify-center">
      <div className="max-w-md mx-auto">
        {/* Logo and Welcome Message */}
        <div className="text-center mb-8">
          <Link to="/" className="block">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="ChefHat" size={32} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground hover:text-primary transition-colors mb-2">
              Welcome to HomeCook Connect
            </h1>
          </Link>
          <p className="text-muted-foreground">
            {activeTab === 'login' ?'Welcome back! Sign in to continue your culinary journey.' :'Join our community of food lovers and talented home chefs.'
            }
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-warm">
          <Image
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop"
            alt="Delicious homemade meal preparation"
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          {features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={feature.icon} size={16} color="var(--color-primary)" />
              </div>
              <div>
                <h3 className="font-medium text-foreground text-sm">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="bg-card rounded-xl p-4 shadow-warm-sm">
          <div className="flex items-start space-x-3">
            <Image
              src={testimonials[activeTab === 'login' ? 0 : 1].avatar}
              alt={testimonials[activeTab === 'login' ? 0 : 1].name}
              className="w-10 h-10 rounded-full object-cover"
              isAvatar={true}
            />
            <div className="flex-1">
              <p className="text-sm text-foreground italic mb-2">
                "{testimonials[activeTab === 'login' ? 0 : 1].quote}"
              </p>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium text-foreground">
                  {testimonials[activeTab === 'login' ? 0 : 1].name}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  {testimonials[activeTab === 'login' ? 0 : 1].role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div>
            <div className="text-lg font-bold text-primary">500+</div>
            <div className="text-xs text-muted-foreground">Home Chefs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">10K+</div>
            <div className="text-xs text-muted-foreground">Happy Customers</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">50K+</div>
            <div className="text-xs text-muted-foreground">Meals Delivered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePanel;