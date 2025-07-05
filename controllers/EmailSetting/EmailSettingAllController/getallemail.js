const User = require("../../../Models/usermode");

const getAllUserEmails = async (req, res) => {
  try {
    const users = await User.find(
      { role: { $in: ['artist', 'seller', 'buyer'] } }, 
      { email: 1, role: 1, _id: 0 } 
    ).lean();

    const filteredUsers = users.filter(
      user => user.email && user.email.trim() !== ''
    );

    if (filteredUsers.length === 0) {
      return res.status(404).json({
        hasError: true,
        message:
          "No valid email addresses found for users with roles artist, seller, or buyer",
      });
    }

    res.status(200).json({
      hasError: false,
      message: "Emails fetched successfully",
      data: filteredUsers,
      count: filteredUsers.length,
    });
  } catch (error) {
    console.error("Error fetching user emails:", error);
    res.status(500).json({
      hasError: true,
      message: "Error fetching user emails",
      error: error.message,
    });
  }
};

module.exports = getAllUserEmails;
