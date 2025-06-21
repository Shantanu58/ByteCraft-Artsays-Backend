const User = require("../../../Models/usermode");


const showWelcomeMessage = async (req, res) => {
    const { email } = req.params;
  
    try {
      const user = await User.findOne({ email }).select("firstName lastName");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const message = `Welcome back, ${user.firstName} ${user.lastName}!`;
      res.json({ message });
    } catch (error) {
      console.error("Error fetching user for welcome message:", error.message);
      res.status(500).json({
        message: "Error fetching user for welcome message",
        error: error.message,
      });
    }
  };

module.exports = showWelcomeMessage
