const EmailSetting = require("../../../Models/EmailSetting");
const nodemailer = require("nodemailer");

const sendTestEmail = async (req, res) => {
  try {
    const { to } = req.body; 

    const emailSettings = await EmailSetting.findOne();
    if (!emailSettings) {
      return res.status(400).json({ message: "Email settings not configured" });
    }

    const transporter = nodemailer.createTransport({
      host: emailSettings.mailHost,
      port: emailSettings.mailPort,
      secure: emailSettings.mailEncryption === "SSL", 
      auth: {
        user: emailSettings.mailUsername,
        pass: emailSettings.mailPassword,
      },
    });

    const mailOptions = {
      from: `${emailSettings.mailFromName} <${emailSettings.mailFromAddress}>`,
      to,
      subject: "Test Email",
      text: "This is a test email to verify your email settings.",
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Test email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = sendTestEmail;