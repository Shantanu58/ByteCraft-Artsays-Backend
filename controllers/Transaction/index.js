const getalltransaction = require("./AllTransaction/getallTransaction");
const getalltransactionbyartistid=require("./AllTransaction/getallartisttransactionbyid")
const getalltransactionbysellerid=require("./AllTransaction/getallsellertransactionbyid")




module.exports = {
 getalltransaction,
 getalltransactionbyartistid,
 getalltransactionbysellerid
};