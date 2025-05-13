const EmailTemplate = require('../../../Models/NewUserTemplate');

const saveEmailSettings = async (req, res) => {
  const { mail_from_name, subject, content } = req.body;

  try {
    let template = await EmailTemplate.findOne();
    if (template) {
      template.mail_from_name = mail_from_name;
      template.subject = subject;
      template.content = content;
    } else {
      template = new EmailTemplate({ mail_from_name, subject, content });
    }
    await template.save();
    res.status(200).json({ message: "Email template saved successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = saveEmailSettings;