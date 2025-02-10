const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    mainImage: {
      type: String,
      required: true,
    },
    otherImages: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

cropSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Crop', cropSchema);
