const { otpStore } = require("./sendOTP");

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (storedOTP.expires < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpStore.delete(email);
    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP", error: error.message });
  }
};

module.exports = verifyOTP;