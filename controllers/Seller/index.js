const getallseller = require("./Seller/getallseller");
const deleteseller=require("./Seller/deleteseller");
const getsellerproduct=require("./SellerProduct/getproduct");
const getsellerproductbyid=require("./SellerProduct/getproductbyuserid");
const sellersoldproduct=require("./SellerProduct/SellerSoldproduct");
const gettransaction=require("./Transaction/fetchtransction");
const packageingmaterialproductseller=require("./PackagingMaterial/getallpackagingmaterial")
const getsoldproductbyid=require("./SellerProduct/getsoldproductbyid")




module.exports = {
  getallseller,
  deleteseller,
  getsellerproduct,
  sellersoldproduct,
  gettransaction,
  packageingmaterialproductseller,
  getsellerproductbyid,
  getsoldproductbyid
};