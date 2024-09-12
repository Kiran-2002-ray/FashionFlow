
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRound = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET = "queenoftears";
const nodemailer = require("nodemailer");
const axios = require('axios');

exports.signup = async (req, res) => {
  const { username, password, email, recaptchaResponse } = req.body;

  const secretKey = process.env.CAPTCHA_KEY; // Replace with your Secret Key
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`; 

  try {
    const verificationResponse = await axios.post(verificationUrl);
    const { success } = verificationResponse.data;

    if (!success) {
      return res.status(400).json({ message: "CAPTCHA verification failed" });
    }

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send("User already exists");
    }

    let hashPassword = await bcrypt.hash(password, saltRound);
    console.log(hashPassword);

    user = new User({ username, password: hashPassword, email });

    await user.save();

    res.send({ message: "saved sucessfully", redirectUrl: "/login.html" });
    // res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user }, JWT_SECRET, { expiresIn: "24h" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
      redirectUrl: "/index.html",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Handle user logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect("/");
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service
      auth: {
        user: "kiranwalia2002@gmail.com", // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password akcn vgqn lrvc rxnt
      },
    });

    const mailOptions = {
      from: "kiranwalia2002@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${verificationCode}`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the code is valid and has not expired
    if (
      user.verificationCode !== code ||
      user.verificationCodeExpiry < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the verification code
    user.password = hashedPassword;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
