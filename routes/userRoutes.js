const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const createMulter = require('../config/multer'); // Import the dynamic multer configuration

// Routes for user management

router.get('/register', userController.showRegisterForm);
router.post('/register', userController.register);

router.get('/login', userController.showLoginForm);
router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/checkEmailAvailability', userController.checkEmailAvailability);

router.get('/profile/:id', userController.getProfile);

// Use dynamic multer for profile image upload
router.post('/profile/update', (req, res, next) => {
  // Configure multer for profile images
  const multer = createMulter('users'); // Use 'users' path for profile images
  multer.single('image')(req, res, next); // Use 'image' as the field name
}, userController.updateProfile);

router.post('/delete/:userId', userController.deleteUser);
router.post('/makeSeller/:userId', userController.makeSeller);

router.get('/', userController.getAllUsers);

module.exports = router;










// routes/userRoutes.js

// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const upload = require('../config/multer'); // Import multer configuration

// // Routes for user management

// router.get('/register', userController.showRegisterForm);
// router.post('/register', userController.register);

// router.get('/login', userController.showLoginForm);
// router.post('/login', userController.login);

// router.get('/logout', userController.logout);

// router.get('/checkEmailAvailability', userController.checkEmailAvailability);

// router.get('/profile/:id',  userController.getProfile);
// router.post('/profile/update', upload.single('profileImage'), userController.updateProfile);

// router.post('/delete/:userId', userController.deleteUser);
// router.post('/makeSeller/:userId', userController.makeSeller);



// router.get('/', userController.getAllUsers);



// module.exports = router;
