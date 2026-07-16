const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrderById,
  trackOrder, getAllOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/track/:orderId', trackOrder);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
