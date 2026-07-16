const User = require('../models/User');

// @GET /api/cart
const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product', 'name price images stock slug');
  res.json(user.cart);
};

// @POST /api/cart/add
const addToCart = async (req, res) => {
  const { productId, name, image, price, quantity = 1, flavor = '' } = req.body;
  const user = await User.findById(req.user._id);

  const existingIndex = user.cart.findIndex(
    (item) => item.product?.toString() === productId && item.flavor === flavor
  );

  if (existingIndex > -1) {
    user.cart[existingIndex].quantity += quantity;
  } else {
    user.cart.push({ product: productId, name, image, price, quantity, flavor });
  }

  await user.save();
  res.json(user.cart);
};

// @PUT /api/cart/update
const updateCartItem = async (req, res) => {
  const { productId, quantity, flavor = '' } = req.body;
  const user = await User.findById(req.user._id);

  const item = user.cart.find(
    (i) => i.product?.toString() === productId && i.flavor === flavor
  );
  if (!item) return res.status(404).json({ message: 'Item not in cart' });

  if (quantity <= 0) {
    user.cart = user.cart.filter(
      (i) => !(i.product?.toString() === productId && i.flavor === flavor)
    );
  } else {
    item.quantity = quantity;
  }

  await user.save();
  res.json(user.cart);
};

// @DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((i) => i.product?.toString() !== req.params.productId);
  await user.save();
  res.json(user.cart);
};

// @DELETE /api/cart/clear
const clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
