const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Prefer MONGO_URI, fallback to MONGO_URL, then default
    const mongoURI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/Hotmello';
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;