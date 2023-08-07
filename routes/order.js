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

router.get('/get/pending-order', async (req, res) => {
    orderController.getAllPendingOrders(req, res);
});

router.get('/get/order-detail/:id', async (req, res) => {
    orderController.getOrder(req, res);
});

router.put('/set/preparing/:id', async (req, res) => {
    orderController.setStatus1(req, res);
});

router.put('/set/delivering/:id', async (req, res) => {
    orderController.setStatus2(req, res);
});

router.put('/set/delivered/:id', async (req, res) => {
    orderController.setStatus3(req, res);
});


module.exports = router;