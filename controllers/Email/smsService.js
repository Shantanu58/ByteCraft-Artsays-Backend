// // smsService.js
// const twilio = require('twilio');

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// const sendSMS = async (phoneNumber, otp) => {
//   try {
//     // Validate phone number format
//     if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
//       throw new Error('Invalid phone number format. Use E.164 format (+1234567890)');
//     }

//     const message = await client.messages.create({
//       body: `Your OTP for password reset is: ${otp}. This code expires in 10 minutes.`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phoneNumber
//     });

//     console.log(`SMS sent to ${phoneNumber}. SID: ${message.sid}`);
//     return true;
//   } catch (error) {
//     console.error('Twilio SMS error:', error);
//     throw new Error('Failed to send SMS. Please try again later.');
//   }
// };

// module.exports = sendSMS;

const axios = require('axios');

async function sendSMS(phoneNumber, otp) {
  try {

    const payload = {
      sender: process.env.SMS_SENDER_ID,
      route: '4',
      country: '91', 
      sms: [
        {
          message: `Your OTP is ${otp}. Valid for 10 minutes.`,
          to: [phoneNumber]
        }
      ]
    };


    const response = await axios.post(
      process.env.SMS_API_ENDPOINT,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'authkey': process.env.SMS_API_KEY 
        }
      }
    );

    if (response.data.type !== 'success') {
      throw new Error(response.data.message || 'SMS failed');
    }

    console.log(`SMS sent to ${phoneNumber}`);
    return true;
  } catch (error) {
    console.error('SMS Error:', error.response?.data || error.message);
    throw new Error('Failed to send SMS');
  }
}

module.exports = sendSMS;