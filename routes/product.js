const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/ProductController');

// Store
router.post('/add-product', async (req, res) => {
    productController.AddProduct(req, res);
});

// Show all
router.get('/', async (req, res) => {
    productController.ShowAll(req, res);
});

// Show detail
router.get('/get/:id', async (req, res) => {
    productController.ShowDetail(req, res);
});

// Update
router.put('/update/:id', async (req, res) => {
    productController.Update(req, res);
});

// Delete
router.delete('/:id', async (req, res) => {
    productController.Delete(req, res);
});

// Search
router.get('/search', async (req, res) => {
    productController.Search(req, res);
});

module.exports = router;