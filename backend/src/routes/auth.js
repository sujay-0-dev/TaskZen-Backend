const express = require('express');
const router = express.Router();
const {
    register,
    registerValidation,
    login,
    loginValidation,
    logout,
    getMe,
    updateProfile,
    changePassword,
    validate,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
