// config/multerConfig.js

const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Setup multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('multer.diskStorage called');

    const uploadPath = path.join(__dirname, '../public/images/users'); // Set your upload path
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const userId = req.user.id;
    cb(null, `${userId}.jpg`); // Save file as userId.jpg
  }
});

// Create multer instance
const upload = multer({ storage });

module.exports = upload;
