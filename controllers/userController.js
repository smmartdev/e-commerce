// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createMulter = require('../config/multer'); // Import the dynamic multer configuration


exports.showRegisterForm = (req, res) => {
  console.log('showRegisterForm called');
  try {
    const properties = req.properties;
    if (properties.isLogged) {
      res.render('pages/register', { properties });
    } else {
      res.render('pages/register', { properties });
    }
  } catch (error) {
    res.render('pages/404', { error })
  }
};

exports.register = async (req, res) => {
  console.log('register called');
  try {
    const { name, email, address } = req.body;
    const plainPassword = req.body.password;
    const password = await bcrypt.hash(plainPassword, 10);
    const properties = req.properties;
    const user = new User({ name, email, password, address });
    await user.save();
    // Create and sign a JWT token
    const auth_token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    // Set the token in a cookie
    res.cookie('auth_token', auth_token, { httpOnly: true });
    res.render('pages/profile', { user, properties });
  } catch (error) {
    res.render('pages/404', { error })

  }
};


exports.updateProfile = (req, res) => {
  // Create a multer instance for profile images
  const multer = createMulter('users'); // Use 'users' path for profile images

  // Use multer middleware to handle file uploads
  multer.single('image')(req, res, async (err) => {
    if (err) {
      return res.render('pages/404', { error: err });
    }

    console.log('updateProfile called');
    try {
      const properties = req.properties;

      const { name, email, address, userId } = req.body;

      // Path to the uploaded image
      const profileImagePath = req.file ? `/images/users/${userId}.jpg` : undefined;

      // Prepare updated fields
      const updatedFields = { name, email, address };
      if (profileImagePath) {
        updatedFields.profileImage = profileImagePath; // Update with new profile image path
      }

      // Find and update the user
      const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true, runValidators: true });
      if (!user) {
        throw new Error('User not found!');
      }
      
      // Render profile page with updated user
      res.render('pages/profile', { properties, user });
    } catch (error) {
      res.render('pages/404', { error });
    }
  });
};

exports.deleteUser = async (req, res) => {
  console.log('deleteUser called');
  try {
    const userToDeleteId = req.params.userId;//user to delete
    const properties = req.properties;
    const user = await User.findByIdAndDelete(userToDeleteId);
    console.log({ user });
    if (!user) {
      throw new Error('User not found!');
    }
    if (properties.isLogged && properties.isAdmin) {
      const users = await User.find();
      res.render('pages/users', { users, properties });
    } else {
      throw new Error('Access restriction');
    }

  } catch (error) {
    res.render('pages/404', { error });
  }
};

exports.checkEmailAvailability = async (req, res) => {
  console.log('checkEmailAvailability called');
  const email = req.query.email;
  console.log({ email });
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

      res.render('pages/login' ,{properties});
    } else {
      console.log('isLogged false');
      res.render('pages/login', { properties, redirectUrl });
    }
  } catch (error) {
    res.render('pages/404', { error })
  }
  // res.render('pages/login', { loginError: false });
};

exports.login = async (req, res) => {
  console.log('login called');
  try {
    const redirectUrl = req.query.redirectUrl;
    const properties = req.properties;
    if (properties.isLogged) {
      const user = await User.findById(properties.userId);
      return res.render('pages/profile', { user, properties });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('pages/login', { redirectUrl });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.render('pages/login', {redirectUrl });
    }

    const auth_token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.cookie('auth_token', auth_token, { httpOnly: true });

    if (redirectUrl == '/users/profile') {
      console.log('redirectUrl == /users/profile');
      res.render('pages/profile', { user, properties });

    } else {
      res.redirect(redirectUrl)
    }

  } catch (error) {
    if (error.message=='jwt expired') {
      return res.render('pages/login', { redirectUrl });
    }
    res.render('pages/404', { error })

  }
};

exports.logout = (req, res) => {
  console.log('logout called');
  try {
    res.clearCookie('auth_token'); // Clear the authentication token cookie
    res.redirect('/users/login'); // Redirect to the login page
  } catch (error) {
    res.render('pages/404', { error })
  }
  // res.render('pages/login', { loginError: false });
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
      res.render('pages/login');
    }
  } catch (error) {
    res.render('pages/404', { error, function: 'getProfile' })
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
    const userTomakeSeller = req.params.userId;//user to delete
    const user = await User.findOneAndUpdate({ _id: userTomakeSeller }, { role: 'seller' });
    if (!user) {
      throw new Error('User not found!');
    }
    if (properties.isLogged && properties.isAdmin) {
      const users = await User.find();
      res.render('pages/users', { properties, users });
    } else {
      throw new Error('Access restriction');
    }
  } catch (error) {
    res.render('pages/404', { error });
  }
};




