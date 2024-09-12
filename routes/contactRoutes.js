const express = require("express");
const router = express.Router();
const contactControllers = require("../controllers/contactControllers");
const verifyToken = require("../middleware/verifyToken");

router.post("/sendContact", verifyToken, contactControllers.contact);

module.exports = router;
