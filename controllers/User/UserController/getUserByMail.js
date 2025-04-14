const User = require("../../../Models/usermode");

const getUserByEmail = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email }).select(
        "firstName lastName"
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ firstName: user.firstName, lastName: user.lastName });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

module.exports = getUserByEmail