const express = require("express");
const router = express.Router();
const path = require("path");
const authController = require("../controllers/authControllers");
const verifyToken = require('../middleware/verifyToken');

// Serve the signup page
router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "signup.html")); // Adjust path if needed
});

// Serve the login page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "login.html")); // Adjust path if needed
});

// Handle signup
router.post("/signup", authController.signup);

// Handle login
router.post("/login", authController.login);

// Handle logout with token verification
router.get("/logout", authController.logout);

router.post('/forgotPassword',authController.forgotPassword)
router.post('/resetPassword',authController.resetPassword);
module.exports = router;   
