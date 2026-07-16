const express = require('express');
const router = express.Router();
const {
  getProfile, updateProfile, addAddress, deleteAddress,
  toggleWishlist, subscribeNewsletter, getAllUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.post('/newsletter', protect, subscribeNewsletter);
router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;
