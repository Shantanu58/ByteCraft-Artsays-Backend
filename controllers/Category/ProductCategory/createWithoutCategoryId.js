const SubCategory = require("../../../Models/SubCategory");
const Category = require("../../../Models/Category");
const SubCategoryValidator = require("../../../Validators/Category/SubCategoryValidator");

const create = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body]; // Ensure it handles both single and multiple entries
    
        // Validate all entries before proceeding
        for (const entry of data) {
          const { error } =
            SubCategoryValidator.SubCategoryValidatorWithoutCategoryId.validate(
              entry
            );
          if (error?.details?.length) {
            const errorMessages = error.details
              .map((err) => err.message)
              .join(", ");
            return res.status(400).json({ hasError: true, message: errorMessages });
          }
        }
    
        const createdSubCategories = [];
    
        for (const entry of data) {
          const { subCategoryName, categoryName, mainCategoryId } = entry;
    
          let category = await Category.findOne({ categoryName, mainCategoryId });
    
          if (!category) {
            category = new Category({
              categoryName,
              mainCategoryId,
            });
            await category.save();
          }
    
          const subCategoryExists = await SubCategory.findOne({
            subCategoryName,
            categoryId: category._id,
            mainCategoryId,
          });
    
          if (subCategoryExists) {
            return res.status(400).json({
              hasError: true,
              message: `A Sub Category with the name "${subCategoryName}" already exists under this Category.`,
            });
          }
    
          const newSubCategory = new SubCategory({
            subCategoryName,
            categoryId: category._id,
            mainCategoryId,
          });
    
          await newSubCategory.save();
          createdSubCategories.push(newSubCategory);
        }
    
        return res.status(201).json({
          hasError: false,
          message: "Sub Category(s) created successfully.",
          data: createdSubCategories,
        });
      } catch (error) {
        console.error("Error creating Sub Category:", error);
        return res.status(500).json({
          hasError: true,
          message: "Failed to create Sub Category.",
          error: error.message,
        });
      }
    };

module.exports = create;
