const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure different upload directories
const uploadConfig = {
  productImage: "./uploads/productImage",
  certificates: "./uploads/certificates",
  coa: "./uploads/coa"
};

Object.values(uploadConfig).forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destination;
    if (file.fieldname === 'images') destination = uploadConfig.productImage;
    else if (file.fieldname === 'certificateFile') destination = uploadConfig.certificates;
    else if (file.fieldname === 'coaFile') destination = uploadConfig.coa;
    else return cb(new Error('Invalid field name'));
    
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp|pdf/;
  const isValid = allowedFileTypes.test(file.mimetype) && 
                 allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, WEBP, and PDF are allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter,
}).fields([
  { name: "images", maxCount: 8 },
  { name: "certificateFile", maxCount: 1 },
  { name: "coaFile", maxCount: 1 }
]);

module.exports = upload;