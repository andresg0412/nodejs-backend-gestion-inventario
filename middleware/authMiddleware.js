const jwt = require('jsonwebtoken');

const athenticateToken = (req, res, next) => {
    //const authHeader = req.headers['authorization'];
    //const token = authHeader && authHeader.split(' ')[1];
    //const token = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.cookies.auth_token;
    //if (token == null) return res.sendStatus(401);
    
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido' });
        }
        req.user = user; // Agregar el usuario decodificado a la solicitud
        next();
    });
};

module.exports = athenticateToken;