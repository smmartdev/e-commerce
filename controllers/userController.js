// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createMulter = require('../config/multiMulter'); // Import the dynamic multer configuration


exports.showRegisterForm = (req, res) => {
  console.log('showRegisterForm called');
  try {
    const properties = req.properties;
    res.render('pages/register', { properties });
  } catch (error) {
    res.render('pages/404', { error })
  }
};

exports.register = async (req, res) => {
  console.log('register called');
  try {
    const { name, email, address, phone, gender } = req.body;
    const plainPassword = req.body.password;
    const password = await bcrypt.hash(plainPassword, 10);
    const properties = req.properties;
    const user = new User({ name, email, password, address, phone, gender });
    await user.save();
    if (!user) {
      throw new Error('Failed to register');
    }
    // Create and sign a JWT token
    const auth_token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    // Set the token in a cookie
    res.cookie('auth_token', auth_token, { httpOnly: true });
    res.redirect(`/users/profile/${user._id}`)
    // res.render('pages/profile', { user, properties });
  } catch (error) {
    res.render('pages/404', { error })
  }
};

exports.updateProfile = async (req, res) => {
  console.log('updateProfile called');

  try {
    // Extract user profile data from the request body
    const { userId, name, address, phone, gender } = req.body;
      console.log({gender});
      
      if(!userId){throw new Error('userId is required for updating profile');}
    // Extract file information from the request
    const updateUser = await User.findOneAndUpdate({ _id: userId }, { name, address, phone, gender })
    if (updateUser) {
      res.redirect(`/users/profile/${userId}`)
    } else {
      throw new Error('Failed to update profile');
    }
  } catch (error) {
    res.render('pages/404', { error });

  }
};

exports.deleteUser = async (req, res) => {
  console.log('deleteUser called');
  try {
    const userToDeleteId = req.params.userId;//user to delete
    const properties = req.properties;
    const user = await User.findByIdAndDelete(userToDeleteId);
    if (!user) {
      throw new Error('User not found!');
    }

    if (!properties.isLogged || !properties.isAdmin) {
      throw new Error('Access restriction');
    }
    const users = await User.find();
    // res.render('pages/users', { users, properties });
    res.redirect(`/users`)
  } catch (error) {
    res.render('pages/404', { error });
  }
};

exports.checkEmailAvailability = async (req, res) => {
  console.log('checkEmailAvailability called');
  const email = req.query.email;
  const user = await User.findOne({ email });
  if (!user) {
    console.log('email not used');
    res.send(true);
  } else {
    console.log('email  used');
    res.send(false);
  }
};

exports.showLoginForm = (req, res) => {
  console.log('showLoginForm called');
  try {
    const redirectUrl = req.query.redirectUrl;

    const properties = req.properties;
    if (properties.isLogged) {
      console.log('isLogged true');

      res.render('pages/login', { properties });
    } else {
      console.log('isLogged false');
      res.render('pages/login', { properties, redirectUrl });
    }
  } catch (error) {
    res.render('pages/404', { error })
  }
};

exports.login = async (req, res) => {
  console.log('login called');
  try {
    const redirectUrl = req.query.redirectUrl;
    const properties = req.properties;
    if (properties.isLogged) {
      // const user = await User.findById(properties.userId);
      // return res.render('pages/profile', { user, properties });
      return res.redirect(`/users/profile/${req.properties.userId}`)
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const oldData = { email, password };
      return res.render('pages/login', { redirectUrl, loginError: true, oldData });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      const oldData = { email, password };
      return res.render('pages/login', { redirectUrl, loginError: true, oldData });
    }

    const auth_token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.cookie('auth_token', auth_token, { httpOnly: true });

    if (redirectUrl == '/users/profile') {
      console.log('redirectUrl == /users/profile');
      // res.render('pages/profile', { user, properties });
      res.redirect(`/users/profile/${user._id}`)

    } else {
      res.redirect(redirectUrl)
    }

  } catch (error) {
    if (error.message == 'jwt expired') {
      // return res.render('pages/login', { redirectUrl });
      return res.redirect(`/users/login`)
    }
    res.render('pages/404', { error })
  }
};

exports.logout = (req, res) => {
  console.log('logout called');
  try {
    res.clearCookie('auth_token'); // Clear the authentication token cookie
    res.redirect('/'); // Redirect to the login page
  } catch (error) {
    res.render('pages/404', { error })
  }
};

exports.getProfile = async (req, res) => {
  console.log('getProfile called');
  try {
    const properties = req.properties;
    if (properties.isLogged) {
      // Find the user by ID (could be req.params.id or userId if authenticated)
      const user = await User.findById(properties.userId); // Use the userId from token
      if (!user) throw new Error('User not found!');
      res.render('pages/profile', { user, properties });
    } else {
      res.redirect('/users/login');
    }
  } catch (error) {
    res.render('pages/404', { error })
  }
};

exports.getAllUsers = async (req, res) => {
  console.log('getAllUsers called');
  try {
    const properties = req.properties;
    if (properties.isLogged && properties.isAdmin) {
      const users = await User.find();
      res.render('pages/users', { users, properties });
    } else {
      throw new Error('Access restriction');
    }
  } catch (error) {
    res.render('pages/404', { error })
  }
};

exports.makeSeller = async (req, res) => {
  console.log('makeSeller called');
  try {
    const properties = req.properties;
    const userTomakeSeller = req.params.userId;//user to make seler
    const user = await User.findOneAndUpdate({ _id: userTomakeSeller }, { role: 'seller' });
    if (!user) {
      throw new Error('User not found!');
    }
    if (properties.isLogged && properties.isAdmin) {
      // const users = await User.find();
      // res.render('pages/users', { properties, users });
      res.redirect('/users')
    } else {
      throw new Error('Access restriction');
    }
  } catch (error) {
    res.render('pages/404', { error });
  }
};




