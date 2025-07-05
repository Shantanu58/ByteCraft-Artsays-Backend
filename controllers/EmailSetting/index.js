const saveOrUpdateEmailSettings = require("./EmailSettingAllController/SaveOrUpdateEmailSetting");
const getEmailSettings = require("./EmailSettingAllController/getEmailSetting")
const sendTestEmail = require("./EmailSettingAllController/SendTestMail")
const getAllUserEmails = require("./EmailSettingAllController/getallemail")

module.exports = {
    saveOrUpdateEmailSettings,
    getEmailSettings,
    sendTestEmail,
    getAllUserEmails,
  };