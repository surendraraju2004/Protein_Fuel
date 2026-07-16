const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  house: { type: String, required: true },
  street: { type: String, required: true },
  landmark: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  image: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  flavor: String,
});

const rewardHistorySchema = new mongoose.Schema({
  points: Number,
  type: { type: String, enum: ['earn', 'redeem'] },
  reason: String,
  date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  addresses: [addressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [cartItemSchema],
  newsletterSubscribed: { type: Boolean, default: false },
  loyaltyPoints: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rewardHistory: [rewardHistorySchema],
  goal: {
    type: String,
    enum: ['lose-fat', 'gain-muscle', 'maintain-weight', ''],
    default: '',
  },
  dietPreference: {
    type: String,
    enum: ['vegan', 'vegetarian', 'non-veg', 'keto', ''],
    default: '',
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate referral code on create
userSchema.pre('save', function (next) {
  if (!this.referralCode) {
    this.referralCode = 'NB' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
