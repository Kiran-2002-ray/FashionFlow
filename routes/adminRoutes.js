const express= require('express')
const router = express.Router();
const adminController= require('../controllers/adminControllers');
const verifyToken = require('../middleware/verifyToken');
const checkAdmin = require('../middleware/checkAdmin')

router.get('/products',verifyToken,checkAdmin,adminController.products)
router.get('/products/:productId',verifyToken,checkAdmin,adminController.editProduct)
router.put('/products/:productId',verifyToken,checkAdmin,adminController.saveEditProduct)
router.delete('/products/:productId',verifyToken,checkAdmin,adminController.deleteProduct)
router.post('/addProducts',verifyToken,adminController.addProducts)

router.get('/users',verifyToken,checkAdmin,adminController.users);
router.post('/addUsers',verifyToken,checkAdmin,adminController.addUsers)
router.delete('/users/:userId',verifyToken,checkAdmin,adminController.deleteUser)

router.get('/categories',verifyToken,checkAdmin,adminController.categories);
router.get('/orders',verifyToken,checkAdmin,adminController.orders)


module.exports=router;