const createSubCategory = require("./ProductCategory/create.js");
const createWithoutIds = require("./ProductCategory/createWithoutId.js");
const createWithoutCategoryId = require("./ProductCategory/createWithoutCategoryId.js");
const getAllSubCategoryByCategoryId = require("./ProductCategory/getByCategoryId.js");
const getAllSubcategory = require("./ProductCategory/getall.js");
const updateSubCategory = require("./ProductCategory/updateSubCategory.js");
const deleteSubCategory = require("./ProductCategory/deleteSubCategory.js");
const updateWithoutIds = require("./ProductCategory/updateWithoutIds.js");
const getallmaincategory =require("./ProductCategory/getAllMain.js");
const getmaincategorybyid =require("./ProductCategory/getMainvyid.js")



const createBlogCategory = require("./BlogCategory/create");
const getBlogCategory = require("./BlogCategory/getcategory");
const updateBlogCategory = require("./BlogCategory/update");
const deleteBlogCategory = require("./BlogCategory/delete");

module.exports={
  createSubCategory,
  createWithoutIds,
  createWithoutCategoryId,
  getAllSubCategoryByCategoryId,
  getAllSubcategory,
  updateSubCategory,
  deleteSubCategory,
  updateWithoutIds,
  getallmaincategory,
  getmaincategorybyid,

  createBlogCategory,
  getBlogCategory,
  updateBlogCategory,
  deleteBlogCategory
};