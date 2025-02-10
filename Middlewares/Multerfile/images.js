const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const cropImageAttachmentDir = "./uploads/CropImage";
if (!fs.existsSync(cropImageAttachmentDir)) {
  fs.mkdirSync(cropImageAttachmentDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, cropImageAttachmentDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const isMimeTypeValid = allowedFileTypes.test(file.mimetype);
  const isExtNameValid = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

  if (isMimeTypeValid && isExtNameValid) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG, or PNG files are allowed."));
  }
};

// Multer upload configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter,
}).fields([
  { name: "mainImage", maxCount: 1 }, 
  { name: "otherImages", maxCount: 10 }, 
]);

// Function to handle base64 image uploads
const saveBase64Image = (base64String, fileName) => {
  const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid base64 format.");
  }

  const ext = matches[1]; // jpg, png, etc.
  const buffer = Buffer.from(matches[2], "base64");
  const filePath = path.join(cropImageAttachmentDir, `${fileName}.${ext}`);

  fs.writeFileSync(filePath, buffer); // Save file
  return filePath; // Return saved file path
};

// Middleware to handle base64 image uploads
const handleBase64Images = (req, res, next) => {
  try {
    if (req.body.base64Image) {
      const fileName = `image_${Date.now()}`;
      const filePath = saveBase64Image(req.body.base64Image, fileName);
      req.savedImagePath = filePath; // Store file path in request
    }
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { upload, handleBase64Images };
