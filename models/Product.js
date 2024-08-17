// models/Product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String
  },
  stock: {
    type: Number,
    required: true
  },
  image: {
    type: String // URL or path to product image
  },
  image2: {
    type: String // URL or path to product image
  },
  image3: {
    type: String // URL or path to product image
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
