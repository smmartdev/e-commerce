const multer = require('multer');
const path = require('path');

// Factory function to create multer middleware with dynamic storage and field handling
const multerMiddleware = (maxCount, imageFields, destinationPath) => {
  console.log('multerMiddleware called');
  let filesList = [];
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('destination called');
      console.log('req.productId: ', req.destinationPath)
      const destinationPath_ = req.destinationPath || destinationPath;

      cb(null, destinationPath_);
    },
    filename: (req, file, cb) => {
      console.log('filename called');
      const counter = req.fileCounter || 1; // Default to 1 if not set
      const filename = req.body.userId || `img${counter}${path.extname(file.originalname)}`;
      req.fileCounter = counter + 1
      filesList.push(filename)
      cb(null, filename);
    }
  });

  // Create multer instance
  const upload = multer({ storage });
  return (req, res, next) => {
    upload.array(imageFields, maxCount)(req, res, (err) => {
      if (err) {
        req.uploadResult = false;
        return next(err); // Handle multer errors
      }
      // Proceed with your business logic
      req.uploadResult = true;
      req.fileList = filesList
      next();
    });
  };
};

module.exports = multerMiddleware;
