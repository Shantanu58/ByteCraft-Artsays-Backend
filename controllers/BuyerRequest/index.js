const createBuyerRequest = require("./BuyerCustomRequest/create");
const getBuyerrequest =require("./BuyerCustomRequest/getdata");
const deleterequestdata =require("./BuyerCustomRequest/deletedata");
const updatebuyerrequest =require("./BuyerCustomRequest/update");
const getBuyerrequestdata=require("./BuyerRequest/getbuyerdata");
const updateRequestStatusByBuyerId =require("./BuyerRequest/updaterequeststatus")


module.exports = {
    createBuyerRequest,
    getBuyerrequest,
    deleterequestdata,
    updatebuyerrequest,
    getBuyerrequestdata,
    updateRequestStatusByBuyerId
};