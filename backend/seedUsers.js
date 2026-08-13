const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to database
connectDB();

// Mock users from LoginForm.jsx
const mockUsers = [
  {
    fullName: 'Customer User',
    email: 'customer@homecook.com',
    password: 'customer123',
    userType: 'customer'
  },
  {
    fullName: 'Chef User',
    email: 'chef@homecook.com',
    password: 'chef123',
    userType: 'chef'
  }
];

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({ 
      email: { $in: mockUsers.map(user => user.email) } 
    });
    
    console.log('Deleted existing mock users');
    
    // Create new users with hashed passwords
    for (const user of mockUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      await User.create({
        ...user,
        password: hashedPassword
      });
      
      console.log(`Created user: ${user.email}`);
    }
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedUsers();