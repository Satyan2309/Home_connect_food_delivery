import api from './api';
import { toast } from 'react-hot-toast';

// Cart service functions
const cartService = {
  // Get cart items
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch cart';
    }
  },

  // Add item to cart
  addToCart: async ({ mealId, quantity }) => {
    try {
      const response = await api.post('/cart/add', { mealId, quantity });
      
      // Update local storage cart count for header display
      const currentCount = parseInt(localStorage.getItem('cartCount') || '0');
      localStorage.setItem('cartCount', (currentCount + quantity).toString());
      
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add item to cart';
    }
  },

  // Update cart item quantity
  updateCartItem: async ({ cartItemId, quantity }) => {
    try {
      const response = await api.put(`/cart/update/${cartItemId}`, { quantity });
      
      // Update local storage cart count
      const cart = await cartService.getCart();
      const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem('cartCount', cartCount.toString());
      
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update cart item';
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    try {
      const response = await api.delete(`/cart/remove/${cartItemId}`);
      
      // Update local storage cart count
      const cart = await cartService.getCart();
      const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
      localStorage.setItem('cartCount', cartCount.toString());
      
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to remove item from cart';
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await api.delete('/cart/clear');
      
      // Update local storage cart count
      localStorage.setItem('cartCount', '0');
      
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to clear cart';
    }
  },

  // Apply promo code
  applyPromoCode: async (code) => {
    try {
      const response = await api.post('/cart/promo', { code });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to apply promo code';
    }
  },

  // Remove promo code
  removePromoCode: async () => {
    try {
      const response = await api.delete('/cart/promo');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to remove promo code';
    }
  },
};

export default cartService;