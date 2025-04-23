const mongoose = require("mongoose");

const UserPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
    unique: true
  },
  preferredArtCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory"
    }
  ],
  subscribeNewsletters: {
    type: String,
    enum: ["yes", "no"],
    default: "no"
  },
  smsEmailAlerts: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const UserPreferences = mongoose.model("UserPreferences", UserPreferencesSchema);

module.exports = UserPreferences;
