const express = require('express');
const router= express.Router();
const orderControllers= require('../controllers/orderControllers');
const verifyToken = require('../middleware/verifyToken');

router.post('/create',verifyToken,orderControllers.createOrder)
router.get('/getOrders',verifyToken,orderControllers.getOrders)
module.exports= router;