import MenuItem from '../models/menu.model.js';
import { v4 as uuidv4 } from 'uuid';

export const createMenuItem = async (req, res) => {
  const { role, id: chefId, name: chefName } = req.user;
  if (role !== 'chef') return res.status(403).json({ message: 'Only chefs can create menu items' });

  const item = new MenuItem({
    id: uuidv4(),
    chef_id: chefId,
    ...req.body,
  });

  try {
    await item.save();
    res.status(201).json({ ...item.toObject(), chef_name: chefName });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create item', error: err.message });
  }
};

export const getMenuItems = async (req, res) => {
  const { category, chef_id, available_only = 'true', search, page = 1, limit = 20 } = req.query;
  const query = {};
  if (category) query.category = category;
  if (chef_id) query.chef_id = chef_id;
  if (available_only === 'true') query.is_available = true;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      MenuItem.find(query).skip(skip).limit(parseInt(limit)).sort({ created_at: -1 }),
      MenuItem.countDocuments(query),
    ]);
    res.json({ items, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items', error: err.message });
  }
};

export const getMyMenuItems = async (req, res) => {
  if (req.user.role !== 'chef') return res.status(403).json({ message: 'Only chefs can view their menu' });
  const items = await MenuItem.find({ chef_id: req.user.id });
  res.json(items.map(item => ({ ...item.toObject(), chef_name: req.user.name })));
};

export const updateMenuItem = async (req, res) => {
  const { itemId } = req.params;
  const { id: chefId } = req.user;

  try {
    const item = await MenuItem.findOne({ id: itemId, chef_id: chefId });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    Object.assign(item, req.body);
    await item.save();
    res.json({ ...item.toObject(), chef_name: req.user.name });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update item', error: err.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  const { itemId } = req.params;
  const { id: chefId, role } = req.user;

  try {
    const query = role === 'admin' ? { id: itemId } : { id: itemId, chef_id: chefId };
    const item = await MenuItem.findOneAndDelete(query);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete item', error: err.message });
  }
};
