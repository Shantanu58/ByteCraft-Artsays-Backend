const express = require('express');

const { 
    getUserById,
    changePassword ,
    updateuserprofile,
    deleteUserById
} = require('../controllers/getandupdateotheruser');
const { uploadMiddleware } = require('../Middlewares/uploadMiddleware'); 
const router = express.Router();


router.get('/userid/:id', getUserById);
router.put('/users/:id', uploadMiddleware, updateuserprofile);
router.put('/users/:id/change-password', changePassword);
router.delete('/users/:id', deleteUserById);

module.exports = router;

