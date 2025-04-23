const getbuyerproduct = require("./BuyerProductRequest/getproduct");
const updatebuyerproductstatus = require("./BuyerProductRequest/updatebuyerproductstatus");
const fetchbuyerrequestbyid =require("./BuyerProductRequest/fetchproductbybuyerid");
const createproductpurchased = require("./BuyerProductPurchased/createpurchasedproduct");
const getbuyerpurchasedproduct =require("./BuyerProductPurchased/getbuyerpurchasedproduct");
const totalquantityproduct   =require("./Totalpurchasedproductbyartist/totalpurchasesproduct");
const createproductrequest  =require("./BuyerProductPurchased/Createproductrequest");
const getproductrequest  =require("./BuyerProductPurchased/getproductrequest");
const getbuyerproductbyid =require("./BuyerProductPurchased/getproductbyid");
const updtaeproductrequestatus =require("./BuyerProductPurchased/updaterequeststatus");
const getbuyerpurchaseproductdetails=require("./BuyerProductPurchased/getbuyerpruchesproductdetailsbyid");
const buyersoldproduct=require("./BuyerSoldProduct/soldproduct")
const gettransaction=require("./Transaction/gettransaction")
const gettransactionbybuyerid=require("./Transaction/gettransactionbybuyerid")
const packageingmaterialproductbuyer=require("./BuyerPackagingMaterial/buyerpackagingmaterial")
const getbuyerrequestbyid =require("./BuyerProductPurchased/getproductrequestbyid")
const getsoldproductbyid=require("./BuyerSoldProduct/getsoldproductbyid")




module.exports = {
   getbuyerproduct,
   updatebuyerproductstatus,
   fetchbuyerrequestbyid,
   createproductpurchased,
   getbuyerpurchasedproduct,
   totalquantityproduct,
   createproductrequest,
   getproductrequest,
   getbuyerproductbyid,
   updtaeproductrequestatus,
   getbuyerpurchaseproductdetails,
   buyersoldproduct,
   gettransaction,
   packageingmaterialproductbuyer,
   gettransactionbybuyerid,
   getbuyerrequestbyid ,
   getsoldproductbyid
};