const mongoose = require('mongoose');

const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.use(protect);
router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

module.exports = router;
