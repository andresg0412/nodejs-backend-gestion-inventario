const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRole = require('../middleware/authorizeRole');

// Obtener todos los productos filtrados por vendedor
router.get('/products', authenticateToken, authorizeRole(['admin']), adminController.getProductsBySeller);

router.get('/vendors', authenticateToken, authorizeRole(['admin']), adminController.getVendors);

module.exports = router;
