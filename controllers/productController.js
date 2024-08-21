const Product = require('../models/product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllProducts = async (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

exports.addProduct = async (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    const { name, price, quantity, SKU } = req.body;
    const { id: vendorId } = req.user;

    // Validar que todos los campos requeridos estén presentes
    if (!name || !price || !quantity || !SKU || !vendorId) {
        return res.status(400).json({ message: 'Todos los campos son requeridos: name, price, quantity, SKU y vendorId' });
    }

    // Crear nuevo producto
    try {
        const newProduct = await Product.create({ name, price, quantity, SKU, vendorId });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar producto' });
    }
};

exports.getProductById = async (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto' });
    }
};

exports.updateProduct = async (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    const { name, price, quantity, SKU } = req.body;
    
    const { id } = req.params;
    try {
        
        // Verificar si el producto existe
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado1' });
        }

        // Actualizar el proyecto
        const [updated] = await Product.update({ name, price, quantity, SKU }, { where: { id } });
        

        // Verificar si la actualización tuvo efecto
        if (updated === 0) {
            return res.status(404).json({ message: 'Producto no actualizado' });
        }

        // Obtener el producto actualizado
        const updatedProduct = await Product.findByPk(id);
        res.status(200).json(updatedProduct);

    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

exports.deleteProduct = async (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    const { id } = req.params;
    try {
        const deleted = await Product.destroy({ where: { id } });
        if (deleted) {
            res.status(200).json({ message: 'Producto eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
};

exports.getProductByVendor = async (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const vendorId = decoded.id;
        const products = await Product.findAll({ where: { vendorId:vendorId } });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos para este vendedor' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos por vendedor' });
    }
};
