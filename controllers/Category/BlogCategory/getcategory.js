const BlogCategory = require("../../../Models/blogcategory");

const getBlogCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getBlogCategories;
