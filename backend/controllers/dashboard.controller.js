import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import MenuItem from '../models/menu.model.js';

export const getDashboardStats = async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'chef') {
      const orders = await Order.find({ chef_id: req.user.id });
      const menu = await MenuItem.find({ chef_id: req.user.id });

      stats = {
        total_orders: orders.length,
        pending_orders: orders.filter(o => o.status === 'pending').length,
        total_menu_items: menu.length,
        active_menu_items: menu.filter(m => m.is_available).length,
        total_revenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total_amount, 0)
      };
    } else if (req.user.role === 'customer') {
      const orders = await Order.find({ customer_id: req.user.id });

      stats = {
        total_orders: orders.length,
        pending_orders: orders.filter(o => ['pending','confirmed','preparing'].includes(o.status)).length,
        delivered_orders: orders.filter(o => o.status === 'delivered').length,
        total_spent: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total_amount, 0)
      };
    } else if (req.user.role === 'admin') {
      const [orders, users, menu] = await Promise.all([
        Order.find(),
        User.find(),
        MenuItem.find()
      ]);

      stats = {
        total_orders: orders.length,
        total_users: users.length,
        total_chefs: users.filter(u => u.role === 'chef').length,
        total_customers: users.filter(u => u.role === 'customer').length,
        total_menu_items: menu.length,
        platform_revenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total_amount, 0)
      };
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stats', error: err.message });
  }
};