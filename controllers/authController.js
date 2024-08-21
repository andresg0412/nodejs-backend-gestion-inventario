const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



exports.register = async (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    try {
        
        const { email, password, role } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const user = await User.create({
            email,
            password: hashedPassword,
            role,
        });

        // Generar token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error });
    }
};


exports.login = async (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    const { email, password } = req.body;
    try {

        // Encontrar usuario
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        // Enviar el token en una cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // En producción HTTPS
            sameSite: 'strict',
            maxAge: 3600000, // 1 hora
        });

        res.json({ role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

exports.protected = (req, res) => {
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
        
        res.json({ role: decoded.role });
    } catch (error) {
        res.status(401).json({ message: 'No autorizado' });
    }
}

exports.logout = (req, res) => {
    //res.set('Access-Control-Allow-Origin', 'https://magiclog-front.onrender.com');
    //res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE');
    //res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
    //res.set('Access-Control-Allow-Credentials', true);
    res.clearCookie('auth_token');
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
}