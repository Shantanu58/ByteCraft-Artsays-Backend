const BlogCategory = require("../../../Models/blogcategory");

const deleteBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await BlogCategory.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Blog Category not found" });
    }

    await BlogCategory.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = deleteBlogCategory;
