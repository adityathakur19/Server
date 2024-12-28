// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { productController, upload } = require('../controllers/productController');
const protect = require('../middleware/auth');

router.use(protect); // Apply authentication middleware to all routes

router.get('/products', productController.getProducts);
router.post('/products', upload.single('image'), productController.createProduct);
router.put('/products/:id', upload.single('image'), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;