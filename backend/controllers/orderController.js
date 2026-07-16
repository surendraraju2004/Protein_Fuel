const Order = require('../models/Order');
const Product = require('../models/Product');

// @POST /api/orders
const createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0)
    return res.status(400).json({ message: 'No order items' });

  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 60;
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentMethod: paymentMethod || 'COD',
    statusHistory: [{ status: 'Pending', note: 'Order placed successfully' }],
  });

  // Reduce stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  res.status(201).json(order);
};

// @GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @GET /api/orders/:id
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name images');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  res.json(order);
};

// @GET /api/orders/track/:orderId
const trackOrder = async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ orderId: order.orderId, status: order.status, statusHistory: order.statusHistory });
};

// @GET /api/orders (admin)
const getAllOrders = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const query = req.query.status ? { status: req.query.status } : {};
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ orders, total, pages: Math.ceil(total / limit) });
};

// @PUT /api/orders/:id/status (admin)
const updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.status = status;
  order.statusHistory.push({ status, note: note || '' });
  if (status === 'Delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }

  await order.save();
  res.json(order);
};

module.exports = { createOrder, getMyOrders, getOrderById, trackOrder, getAllOrders, updateOrderStatus };
