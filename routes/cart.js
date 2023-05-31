const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/CartController');

// Store
router.post('/add-cart', async (req, res) => {
    cartController.AddCart(req, res);
});

// Show all
router.get('/:id', async (req, res) => {
    cartController.ShowAll(req, res);
});



router.delete('/all', async (req, res) => {
    cartController.DeleteAll(req, res);
});

// Delete
router.delete('/:id', async (req, res) => {
    if (req.params.id === 'all') {
        next(); 
    } else {
        cartController.Delete(req, res);
    }
    
});

module.exports = router;