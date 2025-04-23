const express = require('express');
const router = express.Router();

const User = require('../../../Models/usermode');


const getsession = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('sessions currentSessionId');
    res.json(user.sessions);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports=getsession;
  