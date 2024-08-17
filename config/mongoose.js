// config.js

const mongoose = require('mongoose');

// Replace with your MongoDB URI
const mongoURI = 'mongodb://localhost:27017/ecommerce-db';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Uncomment the next line if you're using MongoDB >= 6.0
      // useCreateIndex: true,
      // useFindAndModify: false
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
