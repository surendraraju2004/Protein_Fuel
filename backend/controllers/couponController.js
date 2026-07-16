const Coupon = require('../models/Coupon');

// @POST /api/coupon/validate
const validateCoupon = async (req, res) => {
  const { code, orderAmount } = req.body;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) return res.status(404).json({ message: 'Coupon not found or inactive' });
  if (coupon.expiresAt && new Date() > coupon.expiresAt)
    return res.status(400).json({ message: 'Coupon has expired' });
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses)
    return res.status(400).json({ message: 'Coupon usage limit reached' });
  if (orderAmount < coupon.minOrderAmount)
    return res.status(400).json({ message: `Minimum order amount is ₹${coupon.minOrderAmount}` });

  // Check if user already used it
  if (coupon.usedBy.includes(req.user._id))
    return res.status(400).json({ message: 'You have already used this coupon' });

  let discountAmount = 0;
  if (coupon.discountType === 'percent') {
    discountAmount = (orderAmount * coupon.value) / 100;
    if (coupon.maxDiscountAmount > 0) discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
  } else {
    discountAmount = coupon.value;
  }

  res.json({
    code: coupon.code,
    discountType: coupon.discountType,
    value: coupon.value,
    discountAmount: Math.round(discountAmount),
    description: coupon.description,
  });
};

// @GET /api/coupon (admin)
const getAllCoupons = async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
};

// @POST /api/coupon (admin)
const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
};

// @PUT /api/coupon/:id (admin)
const updateCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(coupon);
};

// @DELETE /api/coupon/:id (admin)
const deleteCoupon = async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Coupon deleted' });
};

module.exports = { validateCoupon, getAllCoupons, createCoupon, updateCoupon, deleteCoupon };
