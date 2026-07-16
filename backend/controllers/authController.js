const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Please fill all fields' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    role: user.role, token: generateToken(user._id),
  });
};

// @POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id, name: user.name, email: user.email,
      role: user.role, avatar: user.avatar, token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('wishlist');
  res.json(user);
};

module.exports = { registerUser, loginUser, getMe };
