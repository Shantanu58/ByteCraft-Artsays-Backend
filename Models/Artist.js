// Models/Artist.js
const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: String,
  bio: String,
  profileImage: String,
  socialMediaLinks: [String],
  artPieces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('Artist', artistSchema);
