const mongoose = require("mongoose");

const emailSettingSchema = new mongoose.Schema(
  {
    mailDriver: {
      type: String,
      required: true,
    },
    mailPort: {
        type: String,
        required: true,
    },
    mailHost: {
        type: String,
        required: true,
      },
      mailUsername: {
        type: String,
        required: true,
      },
      mailPassword: {
        type: String,
        required: true,
      },
      mailEncryption: {
        type: String,
        required: true,
      },
      mailFromAddress: {
        type: String,
        required: true,
      },
      mailFromName: {
        type: String,
        required: true,
      },
  }
);

const EmailSetting = mongoose.model("EmailSetting", emailSettingSchema);

module.exports = EmailSetting;