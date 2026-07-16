const Review = require('../models/Review');
const Product = require('../models/Product');

// @POST /api/reviews
const createReview = async (req, res) => {
  const { product, rating, comment } = req.body;

  const existing = await Review.findOne({ user: req.user._id, product });
  if (existing) return res.status(400).json({ message: 'You have already reviewed this product' });

  const review = await Review.create({
    user: req.user._id,
    product,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  const reviews = await Review.find({ product });
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(product, { ratings: avgRating.toFixed(1), numReviews: reviews.length });

  res.status(201).json(review);
};

// @GET /api/reviews/:productId
const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(reviews);
};

// @DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });

  await review.deleteOne();

  const reviews = await Review.find({ product: review.product });
  const avgRating = reviews.length ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
  await Product.findByIdAndUpdate(review.product, { ratings: avgRating.toFixed(1), numReviews: reviews.length });

  res.json({ message: 'Review deleted' });
};

module.exports = { createReview, getProductReviews, deleteReview };
