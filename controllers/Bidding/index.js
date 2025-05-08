const createbid = require("./Bidding/createbid");
const updatecurrentbid=require("./Bidding/updatecurrentbid")
const getallbid=require("./Bidding/getallbid")
const getallstatusactive=require("./Bidding/gatallstatusactive")
const createbiddedproduct=require("./Biddedproduct/createbiddedproduct")
const getBiddedProducts=require("./Biddedproduct/getbiddedproduct")
const getbiddedproductbybuyerid=require("./Biddedproduct/getbiddedproductbybuyerid")




module.exports = {
   createbid,
   updatecurrentbid,
   getallbid,
   getallstatusactive,
   createbiddedproduct,
   getBiddedProducts,
   getbiddedproductbybuyerid
};