const express = require("express");
const router = express.Router();
const path = require("path");

const categoryController = require("../controllers/categoryControllers")
const productController= require("../controllers/productControllers")
const verifyToken = require('../middleware/verifyToken');

router.get('/getProducts',productController.getProducts);
router.get('/search',productController.searchProducts);


module.exports= router