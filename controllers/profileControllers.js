const User = require("../models/user");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated user
    const user = await User.findById(userId).select("-__v"); // Exclude __v field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.saveProfilePic = async (req, res) => {
  const { profilePicture } = req.body;
  const userId = req.user.id;

  if (!profilePicture) {
    return res.status(400).json({ message: "Profile picture URL is required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error saving profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
};
