// Models/ArtPiece.js
const mongoose = require('mongoose');

const artPieceSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  category: String,
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }
});

module.exports = mongoose.model('ArtPiece', artPieceSchema);
