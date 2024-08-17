// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');


exports.viewCart = async (req, res) => {
  console.log('viewCart called');
  try {
    const properties = req.properties;
    let cart = await Cart.findOne({ userId: req.user.id });
    res.render('pages/cart', { cart:cart||{items:[]}, properties});
  } catch (error) {
    res.render('pages/404', { error })
  }
};


const updateTotalPrice = (cart) => {
  // Calculate total price
  cart.totalPrice = cart.items.reduce((total, item) => total + (item.quantity * item.price), 0);
};

exports.addToCart = async (req, res) => {
  console.log('addToCart called');
  try {
    const properties = req.properties;
    const { productId } = req.params;
    const quantity = req.body.quantity || 1;
    const userId = properties.userId;
    console.log({userId});
    
    // Fetch the product
    let product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).send({ msg: 'Product not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });

    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.product._id.equals(productId));
      if (itemIndex > -1) {
        // Update existing item quantity
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = product.price;  // Update price if needed
      } else {
        // Add new item with entire product object
        cart.items.push({ product, quantity, price: product.price });
      }
      // Update total price
      cart.updateTotalPrice();
      await cart.save();
    } else {
      // Create a new cart with entire product object
      cart = new Cart({
        userId,
        items: [{ product, quantity, price: product.price }],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      // Set initial total price
      cart.updateTotalPrice();
      await cart.save();
    }
    res.render('pages/cart', { cart:cart||{items:[]}, properties});

    // res.status(200).send({ msg: 'Item added successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.render('pages/404', { error })
  }
};


// exports.addToCart = async (req, res) => {
//   console.log('addToCart called');
//   try {
//     const { productId } = req.params;
//     const quantity = req.body.quantity || 1;
//     const userId = req.user.id;
//     let product = await Product.findOne({ _id: productId });
//     const price = product.price;
//     let cart = await Cart.findOne({ userId });

//     if (cart) {
//       const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
//       if (itemIndex > -1) {
//         // Update existing item quantity
//         cart.items[itemIndex].quantity += quantity;
//         cart.items[itemIndex].price = price;  // Update price if needed
//       } else {
//         // Add new item
//         cart.items.push({ productId, quantity, price });
//       }
//       // Update total price
//       updateTotalPrice(cart);
//       await cart.save();
//     } else {
//       // Create a new cart if one doesn't exist
//       cart = new Cart({
//         userId,
//         items: [{ productId, quantity, price }],
//         createdAt: new Date(),
//         updatedAt: new Date()
//       });
//       // Set initial total price
//       updateTotalPrice(cart);
//       await cart.save();

//     }
//     res.status(200).send({ msg: 'item added successfully' })
//   } catch (error) {
//     res.render('pages/404', { error })

//   }
// };


exports.removeFromCart = async (req, res) => {
  console.log('removeFromCart called');

  try {
    const properties = req.properties;
    const { itemId, userId } = req.body;
    // Step 1: Remove the item from the cart
    const result = await Cart.updateOne(
      { userId: userId }, // Find the cart by userId
      { $pull: { items: { _id: itemId } } } // Remove item by _id
    );
    console.log({ result });

    if (result.modifiedCount > 0) {
      console.log('Item successfully removed.');

      // Step 2: Recalculate the total price
      let cart = await Cart.findOne({ userId });

      // Calculate new total price
      const newTotalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

      // Step 3: Update the cart with the new total price
      cart.totalPrice = newTotalPrice;
      await cart.save();

      // Render the updated cart
      res.render('pages/cart', { cart, properties });
    } else {
      console.log('Item not found or already removed.');
      throw new Error('Item not found or already removed.');
    }

  } catch (error) {
    // Render an error page
    res.render('pages/404', { error });
  }
};

