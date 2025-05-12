const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artistName: { type: String, required: true }, 
  artCategories: { type: [String] }, 
  mediumUsed: { type: [String] }, 
  yearsOfExperience: { type: Number },
  portfolioLink: { type: String },
  achievements: { type: [String] },
  description: { type: String }, 
});

const ArtistDetails = mongoose.models.ArtistDetails || mongoose.model('ArtistDetails', artistSchema);
module.exports = ArtistDetails;
