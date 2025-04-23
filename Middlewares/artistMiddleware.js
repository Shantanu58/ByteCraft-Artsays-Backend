// middlewares/artistMiddleware.js

const isArtist = (req, res, next) => {
    if (req.user && req.user.role === 'Artist') {
      next(); // User is an artist, proceed to the next middleware
    } else {
      return res.status(403).json({ message: "Access denied. Only artists can perform this action." });
    }
  };
  
  module.exports = isArtist;
  