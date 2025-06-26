const mongoose = require("mongoose");

const ProductCategorySchema = new mongoose.Schema(
  {
    mainCategoryName: {
      type: String,
      required: true,
      trim: true
    },
  },
  {
    timestamps: true 
  }
);

const ProductCategory = mongoose.model("ProductCategory", ProductCategorySchema);

module.exports = ProductCategory;
