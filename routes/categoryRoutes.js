const express = require("express");
const router = express.Router();
const path = require("path");

const categoryController = require("../controllers/categoryControllers")
// const verifyToken = require('../middleware/verifyToken');

router.get('/getCategory/:categoryName',categoryController.category)
router.get('/productDetails/:id',categoryController.productDetails)
module.exports= router