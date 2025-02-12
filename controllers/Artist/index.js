const updateproductstatus = require("./ArtistProduct/updateartistproductstatus");
const deleteproduct = require("./ArtistProduct/deleteproduct");
const fetchbyid = require("./ArtistProduct/fetchproductbyid");
const statusapprovedproduct = require("./ArtistProduct/fetchApprovedproduct");



module.exports = {
    updateproductstatus,
    deleteproduct,
    fetchbyid,
    statusapprovedproduct
};