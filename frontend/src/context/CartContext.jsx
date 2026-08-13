import React, { createContext, useState, useCallback, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('homecook_cart');
    return saved ? JSON.parse(saved) : { items: [], chefId: null };
  });

  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    const saved = localStorage.getItem('delivery_address');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('homecook_cart', JSON.stringify(cart));
  }, [cart]);

  // Persist delivery address
  useEffect(() => {
    if (deliveryAddress) {
      localStorage.setItem('delivery_address', JSON.stringify(deliveryAddress));
    }
  }, [deliveryAddress]);

  const addToCart = useCallback((item) => {
    setCart((prevCart) => {
      // Can only have items from one chef per order
      if (prevCart.chefId && prevCart.chefId !== item.chef_id) {
        alert('You can only order from one chef at a time. Clear your cart to order from another chef.');
        return prevCart;
      }

      const existingItem = prevCart.items.find((i) => i.id === item.id);

      if (existingItem) {
        return {
          ...prevCart,
          items: prevCart.items.map((i) =>
            i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
          )
        };
      }

      return {
        chefId: item.chef_id,
        items: [...prevCart.items, { ...item, quantity: 1 }]
      };
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((i) => i.id !== itemId)
    }));
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      )
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({ items: [], chefId: null });
  }, []);

  const getTotalPrice = useCallback(() => {
    return cart.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }, [cart.items]);

  const getTotalItems = useCallback(() => {
    return cart.items.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart.items]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    deliveryAddress,
    setDeliveryAddress
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
