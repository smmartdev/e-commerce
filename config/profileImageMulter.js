// multerConfig.js
const multer = require('multer');
const path = require('path');

// Define the storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/users'); // Directory where files will be uploaded
  },
  filename: function (req, file, cb) {
    console.log('req.body: ',req.body);
    
    // Create a unique filename using a timestamp and random number
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Use the original file extension
    // cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    cb(null, req.body.userId + path.extname(file.originalname));

  }
});

// Create multer instance with the storage configuration
const upload = multer({ storage: storage });

// Export the multer instance for use in routes
module.exports = upload;
