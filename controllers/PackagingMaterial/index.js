const addproduct= require("./Product/addproduct");
const updateproduct=require("./Product/updateproduct")
const getallproduct =require("./Product/getallproduct");
const getproductbyid =require("./Product/getproductbyid");
const deleteproduct =require("./Product/delete");
const createpurchase=require("./ProductPurchased/create")
const getallpurchased=require("./ProductPurchased/getallpurchased")
const gettransaction=require("./Transaction/gettramsaction")
const getartistpurchasedproductbyid=require("./ProductPurchased/getartistproduct")
const getbuyerpurchasedproductbyid=require("./ProductPurchased/getbuyerproductbyid")
const getsellerpurchasedproductbyid=require("./ProductPurchased/getsellerproductbyid")
const getartisttransactionbyid=require("./Transaction/gettramsactionartist")
const getbuyertransactionbyid=require("./Transaction/gettramsactionartistbuyer")
const getsellertransactionbyid=require("./Transaction/gettramsactionartistseller")

module.exports = {
    addproduct,
    getallproduct,
    getproductbyid,
    deleteproduct,
    createpurchase,
    getallpurchased,
    gettransaction,
    updateproduct,
    getartistpurchasedproductbyid,
    getbuyerpurchasedproductbyid,
    getsellerpurchasedproductbyid,
    getartisttransactionbyid,
    getbuyertransactionbyid,
    getsellertransactionbyid
    
};