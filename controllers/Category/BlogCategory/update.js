const BlogCategory = require("../../../Models/blogcategory");

const updateBlogCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: "Blog Category name is required" });
      }
  
      const updatedCategory = await BlogCategory.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ error: "Blog Category not found" });
      }
  
      res.status(200).json({ message: "Blog Category updated successfully", updatedCategory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = updateBlogCategory;
