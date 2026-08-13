import Order from '../models/order.model.js';
import MenuItem from '../models/menu.model.js';
import User from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (req, res) => {
  const { items, delivery_address, special_instructions } = req.body;
  const customerId = req.user.id;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain items' });
    }

    // Verify items and get chef info
    const menuItems = await MenuItem.find({ id: { $in: items.map(i => i.id) } });

    if (menuItems.length !== items.length) {
      return res.status(400).json({ message: 'Some items not found' });
    }

    // Check all items from same chef
    const chefIds = [...new Set(menuItems.map(m => m.chef_id))];
    if (chefIds.length > 1) {
      return res.status(400).json({ message: 'Items must be from the same chef' });
    }

    const chefId = chefIds[0];

    // Verify availability and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = menuItems.find(m => m.id === item.id);

      if (!menuItem.is_available) {
        return res.status(400).json({ message: `${menuItem.name} is not available` });
      }

      if (menuItem.available_quantity < (item.quantity || 1)) {
        return res.status(400).json({ message: `${menuItem.name} has insufficient quantity` });
      }

      totalAmount += menuItem.price * (item.quantity || 1);
      orderItems.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity || 1
      });

      // Decrement inventory
      menuItem.available_quantity -= (item.quantity || 1);
      await menuItem.save();
    }

    // Create order
    const order = new Order({
      id: uuidv4(),
      customer_id: customerId,
      chef_id: chefId,
      items: orderItems,
      total_amount: totalAmount,
      delivery_address,
      special_instructions: special_instructions || '',
      status: 'pending'
    });

    await order.save();

    // Emit Socket.io event for chef
    const io = req.app.get('io');
    if (io) {
      io.to(`kitchen:${chefId}`).emit('new_order', {
        orderId: order.id,
        items: orderItems,
        total: totalAmount,
        deliveryAddress: delivery_address,
        timestamp: new Date().toISOString()
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query = { customer_id: req.user.id };
    } else if (req.user.role === 'chef') {
      query = { chef_id: req.user.id };
    }
    // admin sees all orders

    const orders = await Order.find(query).sort({ created_at: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Fetch orders failed', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ id: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Authorization check
    const isCustomer = order.customer_id === req.user.id;
    const isChef = order.chef_id === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isChef && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Fetch order failed', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

  try {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findOne({ id: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Authorization check
    if (req.user.role !== 'admin' && order.chef_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const oldStatus = order.status;
    order.status = status;
    order.updated_at = new Date();
    await order.save();

    // Emit Socket.io event
    const io = req.app.get('io');
    if (io) {
      io.to(`order:track:${orderId}`).emit('order_status_update', {
        orderId,
        oldStatus,
        status,
        message: `Order status changed to ${status}`,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Status update failed', error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const customerId = req.user.id;

  try {
    const order = await Order.findOne({ id: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customer_id !== customerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Can only cancel pending or confirmed orders' });
    }

    // Restore inventory
    for (const item of order.items) {
      const menuItem = await MenuItem.findOne({ id: item.id });
      if (menuItem) {
        menuItem.available_quantity += item.quantity;
        await menuItem.save();
      }
    }

    order.status = 'cancelled';
    order.updated_at = new Date();
    await order.save();

    // Emit Socket.io event
    const io = req.app.get('io');
    if (io) {
      io.to(`order:track:${orderId}`).emit('order_status_update', {
        orderId,
        status: 'cancelled',
        message: 'Order has been cancelled',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Cancellation failed', error: error.message });
  }
};
