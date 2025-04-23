const express = require('express');
const router = express.Router();
const User = require('../Models/usermode');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required.' });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token.' });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid refresh token.' });
      }

      const newAccessToken = jwt.sign(
        { userId: user._id, userType: user.userType },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.json({ accessToken: newAccessToken });
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
