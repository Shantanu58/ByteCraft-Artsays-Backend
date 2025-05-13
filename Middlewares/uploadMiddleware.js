const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directory for uploaded profile photos
const uploadDir = 'uploads/profile_photos';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

const uploadMiddleware = (req, res, next) => {
  upload.single('profilePhoto')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

module.exports = { upload, uploadMiddleware };
