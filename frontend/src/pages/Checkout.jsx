import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { paymentAPI } from '../services/api';
import '../styles/checkout.css';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, getTotalPrice, clearCart, deliveryAddress, setDeliveryAddress } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    address: deliveryAddress?.address || '',
    city: deliveryAddress?.city || '',
    postalCode: deliveryAddress?.postalCode || '',
    specialInstructions: ''
  });

  const totalPrice = getTotalPrice();
  const deliveryFee = 50;
  const finalTotal = totalPrice + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setLoading(true);

      // Save delivery address
      setDeliveryAddress({
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode
      });

      // Create order first (backend endpoint needed)
      // Then create Stripe session
      const response = await paymentAPI.createCheckoutSession(user.id);

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <i className="fas fa-shopping-cart"></i>
          <h2>Your cart is empty</h2>
          <p>Add some delicious meals before checking out!</p>
          <button onClick={() => navigate('/menu')} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="items-list">
            {cart.items.map((item) => (
              <div key={item.id} className="item-row">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{finalTotal}</span>
          </div>
        </div>

        {/* Delivery Form */}
        <form onSubmit={handleCheckout} className="delivery-form">
          <h2>Delivery Details</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Special Instructions</label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows="2"
              placeholder="Any dietary restrictions or preferences?"
            />
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Processing...' : `Proceed to Payment (₹${finalTotal})`}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
