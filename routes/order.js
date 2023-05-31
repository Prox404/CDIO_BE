const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/OrderController');

// Store
router.post('/add-order', async (req, res) => {
    orderController.AddOrder(req, res);
});

// Show all
router.get('/:id', async (req, res) => {
    orderController.ShowAll(req, res);
});


module.exports = router;