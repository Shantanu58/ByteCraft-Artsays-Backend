const SubCategory = require("../../../Models/SubCategory");
const Category = require("../../../Models/Category");
const MainCategory =require("../../../Models/MainCategory");

const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
    
        if (!id) {
          return res.status(400).json({
            hasError: true,
            message: "SubCategory ID is required.",
          });
        }
    
        const { subCategoryName, categoryId, mainCategoryId } = req.body;
    
        if (!subCategoryName) {
          return res.status(400).json({
            hasError: true,
            message: "SubCategoryName is required for update.",
          });
        }
    
        if (!categoryId) {
          return res.status(400).json({
            hasError: true,
            message: "CategoryId is required for update.",
          });
        }
    
        if (!mainCategoryId) {
          return res.status(400).json({
            hasError: true,
            message: "MainCategoryId is required for update.",
          });
        }
    
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
          return res.status(404).json({
            hasError: true,
            message: "Category not found.",
          });
        }
    
        const mainCategoryExists = await MainCategory.findById(mainCategoryId);
        if (!mainCategoryExists) {
          return res.status(404).json({
            hasError: true,
            message: "MainCategory not found.",
          });
        }
    
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
          id,
          { $set: { subCategoryName, categoryId, mainCategoryId } },
          { new: true }
        )
          .populate({
            path: "categoryId",
            select: "categoryName",
          })
          .populate({
            path: "mainCategoryId",
            select: "mainCategoryName",
          })
          .select("subCategoryName _id categoryId mainCategoryId")
          .exec();
    
        if (!updatedSubCategory) {
          return res.status(404).json({
            hasError: true,
            message: "SubCategory not found.",
          });
        }
    
        return res.status(200).json({
          hasError: false,
          message: "SubCategory updated successfully.",
          data: {
            id: updatedSubCategory._id,
            mainCategoryId: updatedSubCategory.mainCategoryId?._id || null,
            categoryId: updatedSubCategory.categoryId?._id || null,
            subCategoryName: updatedSubCategory.subCategoryName,
            mainCategoryName:
              updatedSubCategory.mainCategoryId?.mainCategoryName || null,
            categoryName: updatedSubCategory.categoryId?.categoryName || null,
          },
        });
      } catch (error) {
        console.error("Error updating SubCategory:", error.message);
        return res.status(500).json({
          hasError: true,
          message: "Server error",
          error: error.message,
        });
      }
    };
module.exports = updateSubCategory;
