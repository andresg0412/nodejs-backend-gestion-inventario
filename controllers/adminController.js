const Product = require('../models/product');
const User = require('../models/user');

exports.getProductsBySeller = async (req, res) => {
    //.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    const { sellerId } = req.params;
    try {
        const products = await Product.findAll({ where: { sellerId } });
        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: 'No se encontraron productos para este vendedor' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos por vendedor' });
    }
};

exports.getVendors = async (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }
    try {
        const vendors = await User.findAll({ where: { role: 'vendor' } });
        if (vendors.length > 0) {
            res.status(200).json(vendors);
        } else {
            res.status(404).json({ message: 'No se encontraron vendedores' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener vendedores' });
    }
};
