// backend/scripts/createAdmin.js
// Creates an admin user account
//
// Usage: node backend/scripts/createAdmin.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ntxluxuryvans';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'james@silverfoxmedia.co';

    // Check if already exists
    const existing = await User.findOne({ email });
    if (existing) {
      // Update to admin if not already
      existing.role = 'admin';
      await existing.save();
      console.log(`User ${email} updated to admin role.`);
    } else {
      await User.create({
        firstName: 'James',
        lastName: 'McEwen',
        email,
        password: 'Moncton123$',
        role: 'admin',
        isActive: true
      });
      console.log(`Admin account created for ${email}`);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Done.');
  }
}

createAdmin();
