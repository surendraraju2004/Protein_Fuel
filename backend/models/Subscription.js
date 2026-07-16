const mongoose = require('mongoose');

const subscriptionItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: { type: Number, default: 1 },
  price: Number,
});

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly', 'custom'],
    required: true,
  },
  items: [subscriptionItemSchema],
  totalPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }, // percentage discount
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active',
  },
  nextDeliveryDate: { type: Date },
  shippingAddress: {
    fullName: String,
    phone: String,
    house: String,
    street: String,
    city: String,
    state: String,
    pinCode: String,
  },
  paymentMethod: { type: String, default: 'COD' },
  deliveryCount: { type: Number, default: 0 },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
