const EmailSetting = require("../../../Models/EmailSetting");

const saveOrUpdateEmailSettings = async (req, res) => {
  try {
    const emailSettings = await EmailSetting.findOne();

    if (!emailSettings) {
      const newSettings = new EmailSetting(req.body);
      await newSettings.save();
      return res.json({ message: "Email settings saved successfully" });
    } else {
      Object.assign(emailSettings, req.body);
      await emailSettings.save();
      return res.json({ message: "Email settings updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = saveOrUpdateEmailSettings;