const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  house: { type: String, required: true },
  street: { type: String, required: true },
  landmark: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  deliveryInstructions: String,
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, default: () => `PF-${uuidv4().slice(0, 8).toUpperCase()}`, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: { type: shippingAddressSchema, required: true },
  itemsPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  statusHistory: [statusHistorySchema],
  paymentMethod: { type: String, default: 'COD' },
  isPaid: { type: Boolean, default: false },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
