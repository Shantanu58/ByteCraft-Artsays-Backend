const User = require("../../../Models/usermode");

const getUserbypassword = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
      // console.log("Data sent to frontend (getUser):", user);
    } catch (error) {
      console.error("Error fetching user:", error.message);
      res
        .status(500)
        .json({ message: "Error fetching user", error: error.message });
    }
  };

module.exports = getUserbypassword