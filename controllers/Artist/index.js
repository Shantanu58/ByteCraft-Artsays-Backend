const updateproductstatus = require("./ArtistProduct/updateartistproductstatus");
const deleteproduct = require("./ArtistProduct/deleteproduct");
const fetchbyid = require("./ArtistProduct/fetchproductbyid");
const statusapprovedproduct = require("./ArtistProduct/fetchApprovedproduct");
const getProductbyartistid =require("./ArtistProduct/fetchproductbyartistid");
const gettranscation=require("./ArtistProduct/fetchtransction")
const packageingmaterialproduct=require("./ArtistProduct/packagingmaterialproduct")

const getallartistbuyerprodyctdetails=require("./product/getallartistbuyerprdouctdetails")
const getartistproductbyid=require("./product/getartistproductbyid")
const getartistsoldproductbyid=require("./product/getsoldproductbyid")



module.exports = {
    updateproductstatus,
    deleteproduct,
    fetchbyid,
    statusapprovedproduct,
    getProductbyartistid,
    gettranscation,
    packageingmaterialproduct,
    getallartistbuyerprodyctdetails,
    getartistproductbyid,
    getartistsoldproductbyid
};