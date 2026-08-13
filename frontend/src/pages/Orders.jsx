import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { orderAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import '../styles/orders.css';

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { socket } = useSocket();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Subscribe to order updates
    orders.forEach((order) => {
      socket.emit('join_order', order.id);
      socket.on(`order_status_update_${order.id}`, (data) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === data.orderId ? { ...o, status: data.status } : o))
        );
      });
    });

    return () => {
      orders.forEach((order) => {
        socket.off(`order_status_update_${order.id}`);
      });
    };
  }, [socket, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancelOrder(orderId);
        fetchOrders();
      } catch (error) {
        console.error('Cancel error:', error);
        alert('Failed to cancel order');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      confirmed: '#4CAF50',
      preparing: '#2196F3',
      ready: '#9C27B0',
      out_for_delivery: '#FF5722',
      delivered: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[status] || '#999';
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="empty-orders">
          <i className="fas fa-inbox"></i>
          <h2>No Orders Yet</h2>
          <p>Start by ordering some delicious food!</p>
          <button onClick={() => window.location.href = '/menu'} className="btn btn-primary">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>

      <div className="orders-container">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            className="order-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="order-header">
              <div className="order-id">
                <h3>Order #{order.id.slice(0, 8)}</h3>
                <span className="order-date">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div
                className="order-status"
                style={{ borderColor: getStatusColor(order.status) }}
              >
                <span style={{ color: getStatusColor(order.status) }}>
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="order-items">
              <h4>Items:</h4>
              {order.items.map((item, idx) => (
                <p key={idx}>
                  • {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                </p>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <strong>Total: ₹{order.total_amount}</strong>
              </div>

              <div className="order-actions">
                <button className="btn btn-secondary" onClick={() => setSelectedOrder(order)}>
                  Track Order
                </button>

                {['pending', 'confirmed'].includes(order.status) && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setSelectedOrder(null)}>
              <i className="fas fa-times"></i>
            </button>

            <h2>Order Tracking</h2>

            <div className="tracking-timeline">
              {['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'].map(
                (status, idx) => (
                  <div key={status} className="timeline-item">
                    <div
                      className={`timeline-marker ${
                        ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered']
                          .indexOf(selectedOrder.status) >= idx
                          ? 'active'
                          : ''
                      }`}
                    >
                      <i className="fas fa-check"></i>
                    </div>
                    <span className="timeline-label">{status.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                )
              )}
            </div>

            <div className="order-details">
              <p>
                <strong>Delivery Address:</strong> {selectedOrder.delivery_address}
              </p>
              <p>
                <strong>Special Instructions:</strong>{' '}
                {selectedOrder.special_instructions || 'None'}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
