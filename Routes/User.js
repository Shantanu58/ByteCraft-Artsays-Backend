const express = require('express'); 
const verifyJWT = require('../Middlewares/authMiddleware');
const { 
  registerUser, 
  loginUser, 
  getUser, 
  showWelcomeMessage, 
  getUserByEmail, 
  changePassword,
  updateUserProfile 
} = require('../controllers/UserController');
const { uploadMiddleware } = require('../Middlewares/uploadMiddleware'); // Import the middleware
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user/:id', getUser);
router.get('/welcome/:email', showWelcomeMessage);
router.get('/user-by-email/:email', getUserByEmail);
router.put('/user/:id', verifyJWT, uploadMiddleware, updateUserProfile); // Use uploadMiddleware here
router.put('/user/:id/change-password', verifyJWT, changePassword);


module.exports = router;
