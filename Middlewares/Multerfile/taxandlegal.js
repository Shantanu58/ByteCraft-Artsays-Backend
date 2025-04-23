const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "./uploads/Verification";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueSuffix);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /pdf|jpeg|jpg/;
    const isValid = allowedFileTypes.test(file.mimetype) && allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    cb(null, isValid);
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter,
}).fields([
    { name: "gst", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "tan", maxCount: 1 },
    { name: "cin", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "businessCert", maxCount: 1 },
]);

module.exports = upload;
