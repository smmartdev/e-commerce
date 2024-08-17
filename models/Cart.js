const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.Mixed, required: true }, // Store entire product object
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CartSchema.methods.updateTotalPrice = function () {
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.updatedAt = new Date();
};


module.exports = mongoose.model('Cart', CartSchema);

