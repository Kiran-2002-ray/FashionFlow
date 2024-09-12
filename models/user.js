const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique as well
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Define the possible roles
    default: "user", // Set the default role to 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  resetPasswordExpiry: {
    type: Date,
    default: null,
  },
  profilePicture: {
    type: String,
    default: null, // You can set a default image URL if needed
  },
});

module.exports = mongoose.model("User", UserSchema);
