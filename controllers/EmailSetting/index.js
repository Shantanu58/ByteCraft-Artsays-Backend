const saveOrUpdateEmailSettings = require("./EmailSettingAllController/SaveOrUpdateEmailSetting");
const getEmailSettings = require("./EmailSettingAllController/getEmailSetting")
const sendTestEmail = require("./EmailSettingAllController/SendTestMail")

module.exports = {
    saveOrUpdateEmailSettings,
    getEmailSettings,
    sendTestEmail,
  };