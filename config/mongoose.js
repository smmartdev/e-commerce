const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI =process.env.MONGOURL;
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
module.exports = { connectDB,mongoURI, mongooseConnection: mongoose.connection };
