// // controllers/userController.js

// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const createMulter = require('../config/multiMulter'); // Import the dynamic multer configuration


// exports.showRegisterForm = (req, res) => {
//   console.log('showRegisterForm called');
//   try {
//     const properties = req.properties;
//     res.render('pages/register', { properties });
//   } catch (error) {
//     res.render('pages/404', { error })
//   }
// };

// exports.register = async (req, res) => {
//   console.log('register called');
//   try {
//     const { name, email, address, phone, gender } = req.body;
//     const plainPassword = req.body.password;
//     const password = await bcrypt.hash(plainPassword, 10);
//     const properties = req.properties;
//     const user = new User({ name, email, password, address, phone, gender });
//     await user.save();
//     if (!user) {
//       throw new Error('Failed to register');
//     }
//     // Create and sign a JWT token
//     const auth_token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
//     // Set the token in a cookie
//     res.cookie('auth_token', auth_token, { httpOnly: true });
//     res.redirect(`/users/profile/${user._id}`)
//     // res.render('pages/profile', { user, properties });
//   } catch (error) {
//     res.render('pages/404', { error })
//   }
// };

// exports.updateProfile = async (req, res) => {
//   console.log('updateProfile called');

//   try {
//     // Extract user profile data from the request body
//     const { userId, name, address, phone, gender } = req.body;
//       console.log({gender});
      
//       if(!userId){throw new Error('userId is required for updating profile');}
//     // Extract file information from the request
//     const updateUser = await User.findOneAndUpdate({ _id: userId }, { name, address, phone, gender })
//     if (updateUser) {
//       res.redirect(`/users/profile/${userId}`)
//     } else {
//       throw new Error('Failed to update profile');
//     }
//   } catch (error) {
//     res.render('pages/404', { error });

//   }
// };

// exports.deleteUser = async (req, res) => {
//   console.log('deleteUser called');
//   try {
//     const userToDeleteId = req.params.userId;//user to delete
//     const properties = req.properties;
//     const user = await User.findByIdAndDelete(userToDeleteId);
//     if (!user) {
//       throw new Error('User not found!');
//     }

//     if (!properties.isLogged || !properties.isAdmin) {
//       throw new Error('Access restriction');
//     }
//     const users = await User.find();
//     // res.render('pages/users', { users, properties });
//     res.redirect(`/users`)
//   } catch (error) {
//     res.render('pages/404', { error });
//   }
// };

// exports.checkEmailAvailability = async (req, res) => {
//   console.log('checkEmailAvailability called');
//   const email = req.query.email;
//   const user = await User.findOne({ email });
//   if (!user) {
//     console.log('email not used');
//     res.send(true);
//   } else {
//     console.log('email  used');
//     res.send(false);
//   }
// };

// exports.showLoginForm = (req, res) => {
//   console.log('showLoginForm called');
//   try {
//     const redirectUrl = req.query.redirectUrl;

//     const properties = req.properties;
//     if (properties.isLogged) {
//       console.log('isLogged true');

//       res.render('pages/login', { properties });
//     } else {
//       console.log('isLogged false');
//       res.render('pages/login', { properties, redirectUrl });
//     }
//   } catch (error) {
//     res.render('pages/404', { error })
//   }
// };

// exports.login = async (req, res) => {
//   console.log('login called');
//   try {
//     const redirectUrl = req.query.redirectUrl;
//     const properties = req.properties;
//     if (properties.isLogged) {
//       // const user = await User.findById(properties.userId);
//       // return res.render('pages/profile', { user, properties });
//       return res.redirect(`/users/profile/${req.properties.userId}`)
//     }

//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       const oldData = { email, password };
//       return res.render('pages/login', { redirectUrl, loginError: true, oldData });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       const oldData = { email, password };
//       return res.render('pages/login', { redirectUrl, loginError: true, oldData });
//     }

//     const auth_token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
//     res.cookie('auth_token', auth_token, { httpOnly: true });

//     if (redirectUrl == '/users/profile') {
//       console.log('redirectUrl == /users/profile');
//       // res.render('pages/profile', { user, properties });
//       res.redirect(`/users/profile/${user._id}`)

//     } else {
//       res.redirect(redirectUrl)
//     }

//   } catch (error) {
//     if (error.message == 'jwt expired') {
//       // return res.render('pages/login', { redirectUrl });
//       return res.redirect(`/users/login`)
//     }
//     res.render('pages/404', { error })
//   }
// };

// exports.logout = (req, res) => {
//   console.log('logout called');
//   try {
//     res.clearCookie('auth_token'); // Clear the authentication token cookie
//     res.redirect('/'); // Redirect to the login page
//   } catch (error) {
//     res.render('pages/404', { error })
//   }
// };

// exports.getProfile = async (req, res) => {
//   console.log('getProfile called');
//   try {
//     const properties = req.properties;
//     if (properties.isLogged) {
//       // Find the user by ID (could be req.params.id or userId if authenticated)
//       const user = await User.findById(properties.userId); // Use the userId from token
//       if (!user) throw new Error('User not found!');
//       res.render('pages/profile', { user, properties });
//     } else {
//       res.redirect('/users/login');
//     }
//   } catch (error) {
//     res.render('pages/404', { error })
//   }
// };

// exports.getAllUsers = async (req, res) => {
//   console.log('getAllUsers called');
//   try {
//     const properties = req.properties;
//     if (properties.isLogged && properties.isAdmin) {
//       const users = await User.find();
//       res.render('pages/users', { users, properties });
//     } else {
//       throw new Error('Access restriction');
//     }
//   } catch (error) {
//     res.render('pages/404', { error })
//   }
// };

// exports.makeSeller = async (req, res) => {
//   console.log('makeSeller called');
//   try {
//     const properties = req.properties;
//     const userTomakeSeller = req.params.userId;//user to make seler
//     const user = await User.findOneAndUpdate({ _id: userTomakeSeller }, { role: 'seller' });
//     if (!user) {
//       throw new Error('User not found!');
//     }
//     if (properties.isLogged && properties.isAdmin) {
//       // const users = await User.find();
//       // res.render('pages/users', { properties, users });
//       res.redirect('/users')
//     } else {
//       throw new Error('Access restriction');
//     }
//   } catch (error) {
//     res.render('pages/404', { error });
//   }
// };


// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator'); // If you're using express-validator for validation
const createMulter = require('../config/multiMulter'); // Import the dynamic multer configuration

exports.showRegisterForm = (req, res) => {
  console.log('showRegisterForm called');
  try {
    const properties = req.properties || {}; // Use session properties if available
    res.render('pages/register', { properties });
  } catch (error) {
    res.render('pages/404', { error });
  }
};

exports.register = async (req, res) => {
  console.log('register called');
  try {
    const { name, email, address, phone, gender, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, address, phone, gender });
    await user.save();
    req.flash('success_msg', 'Registration successful. Please log in.');
    res.redirect('/users/login');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Registration failed. Please try again.');
    res.redirect('/users/register');
  }
};

exports.updateProfile = async (req, res) => {
  console.log('updateProfile called');
  try {
    const userId = req.session.userId; // Get userId from session
    if (!userId) throw new Error('User not authenticated');

    const { name, address, phone, gender } = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, { name, address, phone, gender }, { new: true });
    if (!updatedUser) throw new Error('Failed to update profile');

    res.redirect(`/users/profile/${userId}`);
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Profile update failed.');
    res.redirect(`/users/profile/${req.session.userId}`);
  }
};

exports.deleteUser = async (req, res) => {
  console.log('deleteUser called');
  try {
    const userToDeleteId = req.params.userId;
    const user = await User.findByIdAndDelete(userToDeleteId);
    if (!user) throw new Error('User not found');

    req.flash('success_msg', 'User deleted successfully.');
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error deleting user.');
    res.redirect('/users');
  }
};

exports.checkEmailAvailability = async (req, res) => {
  console.log('checkEmailAvailability called');
  try {
    const email = req.query.email;
    const user = await User.findOne({ email });
    res.send(!user); // Send true if email is available, false otherwise
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.showLoginForm = (req, res) => {
  console.log('showLoginForm called');
  try {
    const redirectUrl = req.query.redirectUrl || '/';
    const properties = req.properties || {};
    res.render('pages/login', { properties, redirectUrl });
  } catch (error) {
    res.render('pages/404', { error });
  }
};

exports.login = async (req, res) => {
  console.log('login called');
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/users/login');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/users/login');
    }

    // Store user data in session
    req.session.userId = user._id;
    req.properties = {
      isLogged: true,
      isAdmin: user.role === 'admin', // Assuming user.role indicates admin status
    };

    const redirectUrl = req.query.redirectUrl || '/';
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Login failed. Please try again.');
    res.redirect('/users/login');
  }
};

exports.logout = (req, res) => {
  console.log('logout called');
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        req.flash('error_msg', 'Error logging out.');
        return res.redirect('/');
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      req.flash('success_msg', 'Logged out successfully.');
      res.redirect('/users/login');
    });
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Logout failed.');
    res.redirect('/');
  }
};

exports.getProfile = async (req, res) => {
  console.log('getProfile called');
  try {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/users/login');

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    res.render('pages/profile', { user, properties: req.properties || {} });
  } catch (error) {
    console.error(error);
    res.render('pages/404', { error });
  }
};

exports.getAllUsers = async (req, res) => {
  console.log('getAllUsers called');
  try {
    const properties = req.properties || {};
    if (!properties.isLogged || !properties.isAdmin) throw new Error('Access restriction');

    const users = await User.find();
    res.render('pages/users', { users, properties });
  } catch (error) {
    console.error(error);
    res.render('pages/404', { error });
  }
};

exports.makeSeller = async (req, res) => {
  console.log('makeSeller called');
  try {
    const userId = req.params.userId;
    const properties = req.properties || {};
    if (!properties.isLogged || !properties.isAdmin) throw new Error('Access restriction');

    const user = await User.findByIdAndUpdate(userId, { role: 'seller' }, { new: true });
    if (!user) throw new Error('User not found');

    req.flash('success_msg', 'User is now a seller.');
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to make user a seller.');
    res.redirect('/users');
  }
};
