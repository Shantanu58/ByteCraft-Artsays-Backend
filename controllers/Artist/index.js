const updateproductstatus = require("./ArtistProduct/updateartistproductstatus");
const deleteproduct = require("./ArtistProduct/deleteproduct");
const fetchbyid = require("./ArtistProduct/fetchproductbyid");
const statusapprovedproduct = require("./ArtistProduct/fetchApprovedproduct");
const getProductbyartistid =require("./ArtistProduct/fetchproductbyartistid");
const gettranscation=require("./ArtistProduct/fetchtransction")



module.exports = {
    updateproductstatus,
    deleteproduct,
    fetchbyid,
    statusapprovedproduct,
    getProductbyartistid,
    gettranscation
};