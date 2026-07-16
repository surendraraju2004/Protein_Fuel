const Blog = require('../models/Blog');

// @GET /api/blog
const getBlogs = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const query = { published: true };
  if (req.query.category) query.category = req.query.category;
  if (req.query.search) query.$text = { $search: req.query.search };

  const total = await Blog.countDocuments(query);
  const blogs = await Blog.find(query)
    .sort({ publishedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select('-content');

  res.json({ blogs, total, pages: Math.ceil(total / limit), page });
};

// @GET /api/blog/:slug
const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, published: true });
  if (!blog) return res.status(404).json({ message: 'Blog post not found' });
  blog.views += 1;
  await blog.save();
  res.json(blog);
};

// @POST /api/blog (admin)
const createBlog = async (req, res) => {
  const blog = await Blog.create({
    ...req.body,
    publishedAt: req.body.published ? new Date() : undefined,
  });
  res.status(201).json(blog);
};

// @PUT /api/blog/:id (admin)
const updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(blog);
};

// @DELETE /api/blog/:id (admin)
const deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Blog deleted' });
};

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };
