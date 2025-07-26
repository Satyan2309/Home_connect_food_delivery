import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '#' },
      { label: 'How It Works', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' }
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Safety', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Food Safety', href: '#' }
    ],
    legal: [
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Accessibility', href: '#' }
    ],
    forChefs: [
      { label: 'Become a Chef', href: '/chef-profile-menu-management' },
      { label: 'Chef Resources', href: '#' },
      { label: 'Chef Guidelines', href: '#' },
      { label: 'Pricing', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'Youtube', icon: 'Youtube', href: '#' }
  ];

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="ChefHat" size={20} color="white" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                HomeCook Connect
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Connecting food lovers with talented home chefs in your neighborhood. 
              Fresh, homemade meals delivered to your door.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.name}
                >
                  <Icon name={social.icon} size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:col-span-4">
            {/* Company */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Chefs */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">For Chefs</h3>
              <ul className="space-y-3">
                {footerLinks.forChefs.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* App Download Section */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h4 className="font-semibold text-foreground mb-2">Get the App</h4>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="flex items-center space-x-2 bg-muted hover:bg-muted/80 transition-colors px-4 py-2 rounded-lg"
                >
                  <Icon name="Smartphone" size={20} />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Download on the</div>
                    <div className="text-sm font-semibold text-foreground">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 bg-muted hover:bg-muted/80 transition-colors px-4 py-2 rounded-lg"
                >
                  <Icon name="Smartphone" size={20} />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Get it on</div>
                    <div className="text-sm font-semibold text-foreground">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">Stay Updated</div>
                <div className="text-xs text-muted-foreground">Get the latest deals</div>
              </div>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="px-3 py-2 bg-muted border-0 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-40"
                />
                <button className="bg-primary text-primary-foreground px-3 py-2 rounded-r-lg hover:bg-primary/90 transition-colors">
                  <Icon name="Send" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
          <div className="mb-2 sm:mb-0">
            © {currentYear} HomeCook Connect. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>Available in New York, San Francisco, Los Angeles</span>
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={12} />
              <span>USA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;