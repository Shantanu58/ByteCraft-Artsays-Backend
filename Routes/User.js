const express = require('express'); 
const verifyJWT = require('../Middlewares/authMiddleware');
const { 
   changePassword,
   createUser,
   getUser,
   getUserByEmail,
   getUserbypassword,
   loginUser,
   showWelcomeMessage,
   updateUserProfile,
   sendOTP,
   verifyOTP
} = require('../controllers/User/index');
const { uploadMiddleware } = require('../Middlewares/uploadMiddleware'); 
const router = express.Router();

// router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/userbypassword/:id', getUserbypassword);
router.get('/user/:id', getUser);
router.get('/welcome/:email', showWelcomeMessage);
router.get('/user-by-email/:email', getUserByEmail);
router.put('/user/:id', verifyJWT, uploadMiddleware, updateUserProfile); 
router.put('/user/:id/change-password',verifyJWT, changePassword);
router.post('/createuser', createUser);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);


module.exports = router;
