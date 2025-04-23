const express = require('express'); 
const verifyJWT = require('../Middlewares/authMiddleware');
const { 
  registerUser, 
  loginUser, 
  getUser, 
  showWelcomeMessage, 
  getUserByEmail, 
  changePassword,
  updateUserProfile ,
  getUserbypassword,
  createuser
} = require('../controllers/UserController');
const { uploadMiddleware } = require('../Middlewares/uploadMiddleware'); 
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/userbypassword/:id', getUserbypassword);
router.get('/user/:id', getUser);
router.get('/welcome/:email', showWelcomeMessage);
router.get('/user-by-email/:email', getUserByEmail);
router.put('/user/:id', verifyJWT, uploadMiddleware, updateUserProfile); 
router.put('/user/:id/change-password',verifyJWT, changePassword);
router.post('/createuser',createuser);


module.exports = router;
