// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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


exports.updateProfile = async (req, res) => {
  console.log('updateProfile called');
  try {
    const properties = req.properties;

    const { name, email, address, userId } = req.body;

    // Handle file upload
    // multer middleware will handle file upload and saving, no need to handle file here

    if (properties.isLogged) {
      const profileImagePath = req.file ? `/images/users/${userId}.jpg` : undefined; // Path to the uploaded image

      const updatedFields = { name, email, address };
      if (profileImagePath) {
        updatedFields.profileImage = profileImagePath; // Update with new profile image path
      }

      const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true, runValidators: true });
      if (!user) {
        throw new Error('User not found!');
      }
      res.render('pages/profile', { properties, user });
    } else {
      res.render('pages/login', { properties, loginError: false });
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
    const properties = req.properties;
    if (properties.isLogged) {
      console.log('isLogged true');

      res.render('pages/login', { loginError: false, properties });
    } else {
      console.log('isLogged false');
      res.render('pages/login', { loginError: false, properties, redirectUrl: req.query.redirectUrl || '/users/profile' });
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
      return res.render('pages/profile');
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('pages/login', { user, loginError: true, properties, redirectUrl });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.render('pages/login', { user, loginError: true, properties, redirectUrl });
    }

    const auth_token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.cookie('auth_token', auth_token, { httpOnly: true });

    if (redirectUrl == '/users/profile') {
      res.render('pages/profile', { properties });
      // { user, loginError: false, isLogged:true, userId: "" }

    } else {
      res.redirect(redirectUrl)
    }

  } catch (error) {
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
    var userId;
    const properties = req.properties;

    if (properties.isLogged) { userId = properties.userId; }
    // Find the user by ID (could be req.params.id or userId if authenticated)
    const user = await User.findById(userId); // Use the userId from token
    if (!user) throw new Error('User not found!');
    // Render the profile page and pass both user data and token
    res.render('pages/profile', { user, properties });
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




