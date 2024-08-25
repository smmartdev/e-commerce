const express = require('express');
const app = express();
const { connectDB, mongooseConnection } = require('./config/mongoose'); // Import your DB config
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Product = require('./models/Product');
const Message = require('./models/Message');
const { isLogged } = require('./middlewares/verifyToken');
const { checkRole } = require('./middlewares/checkRole');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000
const mongoUrl = process.env.MONGOURL;
const sessionTime=+process.env.SESSION_TIME;
const sessionSecretKey=process.env.SESSION_SECRET_KEY;

console.log({sessionTime});
console.log('typeof', typeof sessionTime);


connectDB();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: sessionSecretKey, // Replace with a strong secret key
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: mongoUrl,
    mongooseConnection: mongooseConnection // Use the mongoose connection
  }),
  cookie: { secure: false, maxAge: sessionTime } 
}));
app.use(isLogged);
app.use(checkRole);

// Routes
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
    res.render('pages/index', { products, properties });
  } catch (error) {
    console.log('error', error.message);
    res.render('pages/404', { error });
  }
});

// Serve contactUs page
app.get('/contactUs', async (req, res) => {
  console.log('contactUs page called');
  try {
    const properties = req.properties;
    res.render('pages/contact_us', { properties });
  } catch (error) {
    // If the token is invalid, redirect to the login page
    console.log('error', error.message);
    res.render('pages/404', { error });
  }
});

// Serve sendUsMessage page
app.post('/sendUsMessage', async (req, res) => {
  console.log('contactUs page called');
  try {
    const { name, email, message } = req.body
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.redirect('/contactUs')
    if (!newMessage) throw new Error('Failed to save you message. please try again')
  } catch (error) {
    console.log('error', error.message);
    res.render('pages/404', { error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
