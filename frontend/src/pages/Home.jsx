import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/home.css';

export function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Authentic Homemade Food, Delivered Fresh
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Order from passionate home chefs in your area. Support local, eat fresh.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/menu" className="btn btn-primary">
              Browse Menu
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-secondary">
                Sign Up as Chef
              </Link>
            )}
          </motion.div>
        </div>

        <div className="hero-image">
          <img src="/hero-food.jpg" alt="Delicious homemade food" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose HomeCook?</h2>

        <div className="features-grid">
          <motion.div
            className="feature-card"
            whileHover={{ y: -10 }}
          >
            <i className="fas fa-leaf"></i>
            <h3>Fresh & Authentic</h3>
            <p>Freshly cooked by local chefs using quality ingredients</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ y: -10 }}
          >
            <i className="fas fa-users"></i>
            <h3>Support Local</h3>
            <p>Help home-based chefs earn while sharing their passion</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ y: -10 }}
          >
            <i className="fas fa-truck"></i>
            <h3>Fast Delivery</h3>
            <p>Quick delivery from preparation to your doorstep</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ y: -10 }}
          >
            <i className="fas fa-star"></i>
            <h3>Rated & Reviewed</h3>
            <p>Read reviews and ratings from real customers</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Taste Amazing Food?</h2>
        <p>Start ordering from our network of talented home chefs today</p>
        <Link to="/menu" className="btn btn-primary btn-large">
          Order Now
        </Link>
      </section>
    </div>
  );
}
