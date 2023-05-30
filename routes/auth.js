const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/AuthController');

// Signup
router.post('/signup', async (req, res) => {
    authController.signup(req, res);
});

// Login
router.post('/login', async (req, res) => {
    authController.login(req, res);
});

// Logout
router.get('/logout', async (req, res) => {
    authController.logout(req, res);
});

module.exports = router;