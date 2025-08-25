import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import authService from '../../utils/authService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState('customer'); 
  const [currentLocation, setCurrentLocation] = useState('Select Location');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  
    const savedCartCount = localStorage.getItem('cartCount') || 0;
    setCartCount(parseInt(savedCartCount));

 
    const authStatus = authService.isAuthenticated();
    setIsAuthenticated(authStatus);

    
    const savedUserRole = localStorage.getItem('userRole') || 'customer';
    setUserRole(savedUserRole);

    
    const savedLocation = localStorage.getItem('currentLocation') || 'Select Location';
    setCurrentLocation(savedLocation);
    
  
    const handleLocationUpdate = (event) => {
      const { location } = event.detail;
      setCurrentLocation(location);
    };
    
    document.addEventListener('locationUpdated', handleLocationUpdate);
   
    return () => {
      document.removeEventListener('locationUpdated', handleLocationUpdate);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLocationClick = () => {

    if (location.pathname === '/') {
      document.dispatchEvent(new CustomEvent('openLocationSelector'));
    } else {
      
      navigate('/');
      

      setTimeout(() => {
        
        document.dispatchEvent(new CustomEvent('openLocationSelector'));
      }, 300); 
    }
  };

  const handleRoleSwitch = async () => {
    try {
      const newRole = userRole === 'customer' ? 'chef' : 'customer';
      
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
    
      setUserRole(newRole);
      
 
      localStorage.setItem('userRole', newRole);
      
      console.log(`Role switched to: ${newRole}`);
    } catch (error) {
      console.error('Error switching roles:', error);
    }
  };

  const handleSignOut = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/');
  };

  const navigationItems = [
    {
      label: 'Discover',
      path: '/meal-discovery-browse',
      icon: 'Search',
      roles: ['customer', 'chef']
    },
    {
      label: 'Orders',
      path: '/order-tracking-history',
      icon: 'Clock',
      roles: ['customer', 'chef']
    },
    {
      label: 'Chef Hub',
      path: '/chef-profile-menu-management',
      icon: 'ChefHat',
      roles: ['chef']
    },
    {
      label: 'Profile',
      path: '/user-profile-settings',
      icon: 'User',
      roles: ['customer', 'chef']
    }
  ];
  
  const visibleNavItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-warm-sm">
      {/* Location Bar */}
      <div className="w-full bg-muted/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            <button
              onClick={handleLocationClick}
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="MapPin" size={14} />
              <span className="truncate max-w-48">{currentLocation}</span>
              <Icon name="ChevronDown" size={14} />
            </button>
            
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Free delivery on orders ₹250+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="ChefHat" size={20} color="white" />
            </div>
            <span className="font-heading font-bold text-xl text-foreground hover:text-primary transition-colors">
              HomeCook Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
            

          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/shopping-cart-checkout"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ShoppingCart" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-mono">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Role Switcher */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRoleSwitch}
              iconName={userRole === 'customer' ? 'ChefHat' : 'User'}
              iconPosition="left"
              className="text-xs"
            >
              {userRole === 'customer' ? 'Switch to Chef' : 'Switch to Customer'}
            </Button>

            {/* Login/Register or Sign Out */}
            {isAuthenticated ? (
              <Button variant="default" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Link to="/user-registration-login">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart */}
            <Link
              to="/shopping-cart-checkout"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="ShoppingCart" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-mono">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMenu}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border shadow-warm">
          <div className="px-4 py-2 space-y-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
            

            
            <div className="border-t border-border pt-2 mt-2">
              <button
                onClick={handleRoleSwitch}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
              >
                <Icon name={userRole === 'customer' ? 'ChefHat' : 'User'} size={18} />
                <span>{userRole === 'customer' ? 'Switch to Chef' : 'Switch to Customer'}</span>
              </button>
              
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full"
                >
                  <Icon name="LogOut" size={18} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  to="/user-registration-login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Icon name="LogIn" size={18} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;