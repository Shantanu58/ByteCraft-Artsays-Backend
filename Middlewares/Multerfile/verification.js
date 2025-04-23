const multer = require("multer");
const path = require("path");
const fs = require("fs");

const verificationAttachmentDir = "./uploads/Verification";


if (!fs.existsSync(verificationAttachmentDir)) {
  fs.mkdirSync(verificationAttachmentDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, verificationAttachmentDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /pdf|jpeg|jpg/;
  const mimeType = allowedFileTypes.test(file.mimetype);
  const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPEG, JPG, or PNG files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter,
});

module.exports = upload;
