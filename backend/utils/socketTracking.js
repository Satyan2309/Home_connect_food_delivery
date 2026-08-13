// Real-Time Order Tracking Service
export function setupOrderTracking(io) {
  io.on('connection', (socket) => {
    console.log(`📱 New connection: ${socket.id}`);

    // Handle order tracking room joins
    socket.on('join_order', (orderId) => {
      socket.join(`order:track:${orderId}`);
      console.log(`✅ Socket ${socket.id} joined order room: order:track:${orderId}`);
      socket.emit('room_joined', { room: `order:track:${orderId}` });
    });

    // Handle kitchen room joins (for chefs)
    socket.on('join_kitchen', (kitchenId) => {
      socket.join(`kitchen:${kitchenId}`);
      console.log(`✅ Socket ${socket.id} joined kitchen: kitchen:${kitchenId}`);
      socket.emit('room_joined', { room: `kitchen:${kitchenId}` });
    });

    // Handle delivery tracking room joins
    socket.on('join_delivery', (deliveryId) => {
      socket.join(`delivery:${deliveryId}`);
      console.log(`✅ Socket ${socket.id} joined delivery: delivery:${deliveryId}`);
      socket.emit('room_joined', { room: `delivery:${deliveryId}` });
    });

    // Broadcast order status updates
    socket.on('order_status_change', (data) => {
      const { orderId, status, message } = data;
      io.to(`order:track:${orderId}`).emit('order_status_update', {
        orderId,
        status,
        message,
        timestamp: new Date().toISOString()
      });
      console.log(`📢 Order ${orderId} status: ${status}`);
    });

    // Broadcast kitchen queue updates
    socket.on('kitchen_order_ready', (data) => {
      const { kitchenId, orderId, message } = data;
      io.to(`kitchen:${kitchenId}`).emit('order_ready', {
        orderId,
        message,
        timestamp: new Date().toISOString()
      });
      io.to(`order:track:${orderId}`).emit('order_status_update', {
        orderId,
        status: 'ready',
        message: 'Your order is ready for pickup',
        timestamp: new Date().toISOString()
      });
    });

    // Broadcast delivery location updates
    socket.on('delivery_location_update', (data) => {
      const { deliveryId, orderId, latitude, longitude, eta } = data;
      io.to(`delivery:${deliveryId}`).emit('location_update', {
        latitude,
        longitude,
        eta,
        timestamp: new Date().toISOString()
      });
      io.to(`order:track:${orderId}`).emit('delivery_location_update', {
        orderId,
        latitude,
        longitude,
        eta,
        timestamp: new Date().toISOString()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`📴 Socket disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error (${socket.id}):`, error);
    });
  });
}

export default setupOrderTracking;
