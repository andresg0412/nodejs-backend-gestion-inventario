const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

// Obtener todos los productos
router.get('/', productController.getAllProducts);

// Obtener todos los productos filtrados por vendedor
router.get('/vendor', authenticateToken, authorizeRole(['vendor']), productController.getProductByVendor);

// Agregar un nuevo producto
router.post('/', authenticateToken, authorizeRole(['vendor']), productController.addProduct);

// Obtener un producto específico
router.get('/:id', productController.getProductById);

// Actualizar un producto
router.put('/:id', authenticateToken, authorizeRole(['vendor']), productController.updateProduct);

// Eliminar un producto
router.delete('/:id', authenticateToken, authorizeRole(['vendor']), productController.deleteProduct);

module.exports = router;
