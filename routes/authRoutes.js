const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { register, login, protected } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { validationResult } = require('express-validator');

// Registro de usuario
//router.post('/register', authController.register);
router.post('/register', registerValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, register);

// Login de usuario
router.post('/login', loginValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, login);

router.get('/protected', protected);

router.post('/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logout successful' });
});

module.exports = router;
