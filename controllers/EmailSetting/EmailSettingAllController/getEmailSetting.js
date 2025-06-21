const EmailSetting = require("../../../Models/EmailSetting");

const getEmailSettings = async (req, res) => {
    try {
      const emailSettings = await EmailSetting.findOne();
      if (!emailSettings) {
        return res.status(404).json({ message: "No email settings found" });
      }
      res.json(emailSettings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = getEmailSettings;