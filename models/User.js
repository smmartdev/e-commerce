// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  phone: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'no-answer'],
    default: 'no-answer'
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'seller'],
    default: 'customer'
  }


}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);