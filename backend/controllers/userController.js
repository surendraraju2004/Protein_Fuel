const User = require('../models/User');

// @GET /api/users/profile
const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('wishlist', 'name price images slug ratings');
  res.json(user);
};

// @PUT /api/users/profile
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, phone: updated.phone, role: updated.role });
};

// @POST /api/users/address
const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json(user.addresses);
};

// @DELETE /api/users/address/:addressId
const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();
  res.json(user.addresses);
};

// @POST /api/users/wishlist/:productId
const toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;
  const index = user.wishlist.indexOf(productId);
  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();
  res.json(user.wishlist);
};

// @POST /api/users/newsletter
const subscribeNewsletter = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.newsletterSubscribed = true;
  await user.save();
  res.json({ message: 'Subscribed successfully!' });
};

// @GET /api/users (admin)
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

module.exports = { getProfile, updateProfile, addAddress, deleteAddress, toggleWishlist, subscribeNewsletter, getAllUsers };
