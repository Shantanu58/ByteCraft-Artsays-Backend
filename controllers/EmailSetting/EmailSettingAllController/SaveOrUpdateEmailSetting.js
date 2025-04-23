const EmailSetting = require("../../../Models/EmailSetting");

const saveOrUpdateEmailSettings = async (req, res) => {
  try {
    // Transform snake_case to camelCase
    const transformedData = {
      mailDriver: req.body.mail_driver,
      mailHost: req.body.mail_host,
      mailPort: req.body.mail_port,
      mailUsername: req.body.mail_username,
      mailPassword: req.body.mail_password,
      mailEncryption: req.body.mail_encryption,
      mailFromAddress: req.body.mail_from_address,
      mailFromName: req.body.mail_from_name
    };

    const emailSettings = await EmailSetting.findOne();

    if (!emailSettings) {
      const newSettings = new EmailSetting(transformedData);
      await newSettings.save();
      return res.json({ 
        success: true,
        message: "Email settings saved successfully" 
      });
    } else {
      Object.assign(emailSettings, transformedData);
      await emailSettings.save();
      return res.json({ 
        success: true,
        message: "Email settings updated successfully" 
      });
    }
  } catch (error) {
    console.error("Error saving email settings:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

module.exports = saveOrUpdateEmailSettings;