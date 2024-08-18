// app.js
const express = require('express');
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
// app.use(bodyParser.json());
// Middleware to parse URL-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const connectDB = require('./config/mongoose');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const jwt = require('jsonwebtoken');
const path = require('path');


const Product = require('./models/Product');
const { isLogged } = require('./middlewares/verifyToken');
const { checkRole } = require('./middlewares/checkRole');



// Connect to MongoDB
connectDB();

// Set EJS as the view engine
app.set('view engine', 'ejs');



app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());




// Routes
app.use(isLogged);
app.use(checkRole);

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/payment', paymentRoutes);
app.use('/cart', cartRoutes);


// Serve home page
app.get('/', async (req, res) => {
  console.log('home page called');

  try {
    const products = await Product.find();
    const properties = req.properties;
    if (properties.isLogged) {
      console.log('isLogged true');
      res.render('pages/index', { products, properties });
    } else {
      console.log('isLogged false');
      res.render('pages/index', { products, properties });
    }
  } catch (error) {
    // If the token is invalid, redirect to the login page
    console.log('error', error.message);
    res.render('pages/404', { error });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
