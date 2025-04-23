const multer = require("multer");
const path = require("path");
const fs = require("fs");

const cropImageAttachmentDir = "./uploads/CropImage";

try {
  if (!fs.existsSync(cropImageAttachmentDir)) {
    fs.mkdirSync(cropImageAttachmentDir, { recursive: true });
  }
} catch (error) {
  console.error("Error creating directory:", error);
}

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

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 5MB limit per file
  fileFilter,
}).fields([
  { name: "mainImage", maxCount: 1 }, // Single image for mainImage
  { name: "otherImages", maxCount: 10 }, // Up to 10 images for otherImages
]);

module.exports = upload;
