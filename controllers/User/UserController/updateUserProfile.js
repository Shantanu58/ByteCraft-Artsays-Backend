const User = require("../../../Models/usermode");

const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
  
    // Check if file exists in request and update profilePhoto path
    if (req.file) {
      updateData.profilePhoto = `/uploads/profile_photos/${req.file.filename}`;
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-password");
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating profile:", error.message);
      res
        .status(500)
        .json({ message: "Error updating profile", error: error.message });
    }
  };

module.exports = updateUserProfile