const { body } = require('express-validator');

const registerValidator = [
    body('email').isEmail().withMessage('Debe proporcionar un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

const loginValidator = [
    body('email').isEmail().withMessage('Debe proporcionar un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

module.exports = { registerValidator, loginValidator };