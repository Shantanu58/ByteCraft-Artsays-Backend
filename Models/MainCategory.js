const mongoose = require("mongoose");

const MainCategorySchema = new mongoose.Schema(
    {
        mainCategoryName: {
          type: String,
          required: true,
          unique: true,
          trim: true,
        },
      },
      { timestamps: true }
    );
const MainCategory = mongoose.model("MainCategory", MainCategorySchema);

module.exports = MainCategory;
