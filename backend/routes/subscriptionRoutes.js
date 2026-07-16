const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Subscription = require('../models/Subscription');

// @GET /api/subscription/my
router.get('/my', protect, async (req, res) => {
  const subs = await Subscription.find({ user: req.user._id })
    .populate('items.product', 'name images price slug')
    .sort({ createdAt: -1 });
  res.json(subs);
});

// @POST /api/subscription
router.post('/', protect, async (req, res) => {
  const { plan, items, shippingAddress, paymentMethod } = req.body;
  const discountMap = { weekly: 15, biweekly: 10, monthly: 8, custom: 5 };
  const totalPrice = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const discount = discountMap[plan] || 0;

  // Next delivery: plan in days
  const daysMap = { weekly: 7, biweekly: 14, monthly: 30, custom: 30 };
  const nextDeliveryDate = new Date();
  nextDeliveryDate.setDate(nextDeliveryDate.getDate() + daysMap[plan]);

  const sub = await Subscription.create({
    user: req.user._id,
    plan,
    items,
    totalPrice,
    discount,
    nextDeliveryDate,
    shippingAddress,
    paymentMethod,
  });
  res.status(201).json(sub);
});

// @PUT /api/subscription/:id/status
router.put('/:id/status', protect, async (req, res) => {
  const sub = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
  if (!sub) return res.status(404).json({ message: 'Subscription not found' });
  sub.status = req.body.status;
  await sub.save();
  res.json(sub);
});

module.exports = router;
