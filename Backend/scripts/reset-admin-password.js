const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hotmello.com';
const NEW_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Hotmello';

const Admin = require('../models/Admin');

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    const email = String(ADMIN_EMAIL).toLowerCase().trim();
    let admin = await Admin.findOne({ email });
    if (!admin) {
      admin = new Admin({ email, password: NEW_PASSWORD });
      await admin.save();
      console.log(`Created admin ${email} with provided password`);
    } else {
      admin.password = NEW_PASSWORD;
      await admin.save();
      console.log(`Updated password for admin ${email}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
