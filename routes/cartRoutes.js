const express = require('express')
const router = express.Router();
const cartController = require('../controllers/cartControllers');
const verifyToken = require('../middleware/verifyToken')

router.post('/add',verifyToken,cartController.add)
router.get('/getCartData',verifyToken,cartController.getCartData)
router.delete('/remove/:productId',verifyToken,cartController.remove);
router.put('/update',verifyToken,cartController.update)

module.exports = router;