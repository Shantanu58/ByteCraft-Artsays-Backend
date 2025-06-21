const BlogCategory = require("../../../Models/blogcategory");

const createBlogCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Blog Category is required" });
    }

    const newCategory = new BlogCategory({ name });
    await newCategory.save();
    res.status(201).json({ message: "Blog Category added successfully", newCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = createBlogCategory;
