import User from '../models/user.model.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import { createToken } from '../utils/jwt.js';
import { v4 as uuidv4 } from 'uuid';

export const registerUser = async (req, res) => {
  const { email, password, name, role, phone, address, location } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await hashPassword(password);
    const newUser = new User({
      id: uuidv4(),
      email,
      password: hashed,
      name,
      role,
      phone,
      address,
      location,
    });

    await newUser.save();
    const token = createToken({ sub: newUser.id, role: newUser.role });

    const { password: _, ...userData } = newUser.toObject();
    res.status(201).json({ access_token: token, token_type: 'bearer', user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = createToken({ sub: user.id, role: user.role });
    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ access_token: token, token_type: 'bearer', user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getProfile = async (req, res) => {
  const { password, ...user } = req.user.toObject();
  res.status(200).json(user);
};
