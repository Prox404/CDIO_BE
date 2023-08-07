const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

// Signup
router.get('/', async (req, res) => {
    userController.getAllUser(req, res);
});

router.get('/get/all/:id', async (req, res) => {
    userController.getAllUserByRole(req, res);
});

router.get('/delete/:id', async (req, res) => {
    userController.deleteUser(req, res);
});

router.post('/add-employee', async (req, res) => {
    userController.addEmployee(req, res);
});

router.get('/get/:id', async (req, res) => {
    userController.getUserById(req, res);
});

router.put('/update/:id', async (req, res) => {
    userController.updateUser(req, res);
});


// Login
// router.post('/login', async (req, res) => {
//     userController.login(req, res);
// });

// // Logout
// router.post('/logout', async (req, res) => {
//     userController.logout(req, res);
// });

module.exports = router;