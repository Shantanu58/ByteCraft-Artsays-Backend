const multer = require("multer");
const path = require("path");
const fs = require("fs");

const cropImageAttachmentDir = "./uploads/CropImage";

if (!fs.existsSync(cropImageAttachmentDir)) {
  fs.mkdirSync(cropImageAttachmentDir, { recursive: true });
}

const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (req.body.type === 'image') {
          cb(null, cropImageAttachmentDir);
        } else {
          cb(null, cropImageAttachmentDir);
        }
      },
      filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, `${timestamp}_${file.originalname}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = /jpeg|jpg|png/;
      const mimeType = allowedFileTypes.test(file.mimetype);
      const extName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  
      if (mimeType && extName) {
        cb(null, true);
      } else {
        cb(new Error("Only JPEG, JPG, or PNG files are allowed"));
      }
    },
  }).single('file');

module.exports = upload;
