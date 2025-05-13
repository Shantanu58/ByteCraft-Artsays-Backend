const createOrUpdateNewUser = require("./NewUser/saveTemplate");
const getContent = require("./NewUser/getTemplate")
const createOrUpdateNewSeller = require("./NewSeller/saveTemplate");
const getContentNewSeller = require("./NewSeller/getTemplate")
const createOrUpdateNewBuyer = require("./NewBuyer/saveTemplate");
const getContentNewBuyer = require("./NewBuyer/getTemplate")

module.exports = {
  createOrUpdateNewUser,
  getContent,
  createOrUpdateNewSeller,
  getContentNewSeller,
  createOrUpdateNewBuyer,
  getContentNewBuyer,
};
