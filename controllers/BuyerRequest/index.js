const createBuyerRequest = require("./BuyerCustomRequest/create");
const getBuyerrequest =require("./BuyerCustomRequest/getdata");
const deleterequestdata =require("./BuyerCustomRequest/deletedata");
const updatebuyerrequest =require("./BuyerCustomRequest/update");
const getBuyerrequestdata=require("./BuyerRequest/getbuyerdata");
const updateRequestStatusByBuyerId =require("./BuyerRequest/updaterequeststatus");
const NegiotaiteBudgetupdate=require("./BuyerRequest/negiotaitebudgetupdate");
const getalldataforadmin =require("./BuyerRequest/getalldataforadmin");
const NegiotaiteBuyerupdate=require("./BuyerCustomRequest/negiotaitebuyerupdate")
const getdatabybuyerid=require("./BuyerRequest/getdatabybuyerid")


module.exports = {
    createBuyerRequest,
    getBuyerrequest,
    deleterequestdata,
    updatebuyerrequest,
    getBuyerrequestdata,
    updateRequestStatusByBuyerId,
    NegiotaiteBudgetupdate,
    getalldataforadmin,
    NegiotaiteBuyerupdate,
    getdatabybuyerid
};