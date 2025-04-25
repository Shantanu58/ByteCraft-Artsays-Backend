const EmailTemplate = require('../../../Models/NewBuyerTemplates');

const getEmailSettings = async (req, res) => {
  try {
    const template = await EmailTemplate.findOne();
    res.status(200).json(template);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = getEmailSettings;