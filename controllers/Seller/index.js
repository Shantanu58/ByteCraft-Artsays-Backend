const getallseller = require("./Seller/getallseller");
const deleteseller=require("./Seller/deleteseller");
const getsellerproduct=require("./SellerProduct/getproduct");
const sellersoldproduct=require("./SellerProduct/SellerSoldproduct");
const gettransaction=require("./Transaction/fetchtransction");




module.exports = {
  getallseller,
  deleteseller,
  getsellerproduct,
  sellersoldproduct,
  gettransaction
};