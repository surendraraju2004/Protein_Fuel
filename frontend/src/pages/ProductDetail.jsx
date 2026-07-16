import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiStar, FiChevronLeft, FiChevronRight, FiCheck, FiShare2 } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../store/wishlistSlice'
import toast from 'react-hot-toast'
import api from '../api/axios'
import Loader from '../components/ui/Loader'
import ProductCard from '../components/products/ProductCard'

export default function ProductDetail() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [activeImg, setActiveImg] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedFlavor, setSelectedFlavor] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [activeTab, setActiveTab] = useState('nutrition')
  const { user, isAuthenticated } = useSelector(s => s.auth)
  const isWishlisted = useSelector(selectIsWishlisted(product?._id))

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${slug}`)
      .then(r => {
        setProduct(r.data)
        setSelectedFlavor(r.data.flavors?.[0] || '')
        // Fetch related
        return api.get(`/products?category=${r.data.category?._id}&limit=4`)
      })
      .then(r => setRelatedProducts(r.data.products.filter(p => p.slug !== slug)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))

    api.get(`/reviews/${slug}`).then(r => setReviews(r.data)).catch(() => {})
  }, [slug])

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity, flavor: selectedFlavor }))
    toast.success(`Added ${quantity}x ${product.name} to cart! 🛒`)
  }

  const handleWishlist = () => {
    dispatch(toggleWishlist(product))
    toast(isWishlisted ? 'Removed from wishlist' : '❤️ Saved to wishlist!')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to review'); return }
    try {
      await api.post(`/reviews/${product._id}`, reviewForm)
      toast.success('Review submitted!')
      const r = await api.get(`/reviews/${slug}`)
      setReviews(r.data)
      setReviewForm({ rating: 5, comment: '' })
    } catch {
      toast.error('Failed to submit review')
    }
  }

  if (loading) return <div className="pt-28"><Loader text="Loading product..." /></div>
  if (!product) return (
    <div className="pt-28 text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="font-outfit font-bold text-white text-2xl mb-2">Product not found</h2>
      <Link to="/products" className="btn-primary mt-4 inline-block">Browse Products</Link>
    </div>
  )

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price
  const discountPct = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0

  const tabs = [
    { key: 'nutrition', label: 'Nutrition Facts' },
    { key: 'ingredients', label: 'Ingredients' },
    { key: 'benefits', label: 'Benefits' },
    { key: 'storage', label: 'Storage & Info' },
  ]

  return (
    <div className="pt-24 section-padding py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-inter text-white/40 mb-8">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-white transition-colors">Products</Link>
        <span>/</span>
        <span className="text-white/70">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* ── IMAGE GALLERY ── */}
        <div>
          <div className="relative rounded-3xl overflow-hidden aspect-square bg-white/5 mb-4 group">
            <motion.img
              key={activeImg}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={product.images?.[activeImg] || 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discountPct > 0 && <span className="badge bg-red-500 text-white">{discountPct}% OFF</span>}
              {product.isBestSeller && <span className="badge bg-gold-500 text-green-950">⭐ Bestseller</span>}
              {product.isVegan && <span className="badge bg-green-500/90 text-white">🌿 Vegan</span>}
              {product.isGlutenFree && <span className="badge bg-blue-500/80 text-white">GF</span>}
            </div>
            {/* Arrows */}
            {product.images?.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20">
                  <FiChevronLeft size={18} />
                </button>
                <button onClick={() => setActiveImg(i => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20">
                  <FiChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-gold-500' : 'border-transparent opacity-50 hover:opacity-80'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── PRODUCT INFO ── */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <Link to={`/products?category=${product.category?.slug}`} className="badge-green mb-2 inline-block">
                {product.category?.name}
              </Link>
              <h1 className="font-outfit font-black text-3xl sm:text-4xl text-white leading-tight">{product.name}</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={handleWishlist} className={`w-10 h-10 glass rounded-xl flex items-center justify-center transition-colors ${isWishlisted ? 'text-red-400' : 'text-white/50 hover:text-red-400'}`}>
                <FiHeart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }).catch(() => {}); toast.success('Link copied!') }}
                className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors">
                <FiShare2 size={16} />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <FiStar key={s} size={16} fill={s <= Math.round(product.ratings) ? 'currentColor' : 'none'}
                  className={s <= Math.round(product.ratings) ? 'text-gold-400' : 'text-white/20'} />
              ))}
            </div>
            <span className="text-white font-outfit font-semibold">{product.ratings.toFixed(1)}</span>
            <span className="text-white/40 text-sm font-inter">({product.numReviews} reviews)</span>
          </div>

          <p className="text-white/65 font-inter leading-relaxed mb-6">{product.description}</p>

          {/* Quick Nutrition */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Calories', value: product.nutrition?.calories, unit: 'kcal', color: 'text-gold-400' },
              { label: 'Protein', value: product.nutrition?.protein, unit: 'g', color: 'text-green-400' },
              { label: 'Carbs', value: product.nutrition?.carbs, unit: 'g', color: 'text-blue-400' },
              { label: 'Fat', value: product.nutrition?.fat, unit: 'g', color: 'text-orange-400' },
            ].map(({ label, value, unit, color }) => (
              <div key={label} className="glass rounded-2xl p-3 text-center">
                <div className={`font-outfit font-bold text-lg ${color}`}>{value}<span className="text-xs font-normal">{unit}</span></div>
                <div className="text-white/40 text-xs font-inter">{label}</div>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-outfit font-black text-4xl text-white">₹{effectivePrice}</span>
            {discountPct > 0 && <>
              <span className="text-white/30 text-xl line-through font-inter">₹{product.price}</span>
              <span className="badge bg-red-500 text-white">{discountPct}% OFF</span>
            </>}
          </div>

          {/* Flavor */}
          {product.flavors?.length > 0 && (
            <div className="mb-6">
              <p className="text-white/60 text-sm font-outfit mb-2">Flavor: <span className="text-gold-400">{selectedFlavor}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.flavors.map(f => (
                  <button key={f} onClick={() => setSelectedFlavor(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-inter border transition-all ${selectedFlavor === f ? 'bg-green-600/30 border-green-500 text-white' : 'glass border-white/10 text-white/60 hover:border-white/30'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-white/60 text-sm font-outfit">Quantity:</p>
            <div className="flex items-center glass rounded-xl overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors font-bold text-lg">−</button>
              <span className="w-10 text-center font-outfit font-semibold text-white">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors font-bold text-lg">+</button>
            </div>
            <span className="text-white/30 text-sm font-inter">{product.stock} in stock</span>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed">
              <FiShoppingCart size={18} /> Add to Cart
            </button>
            <Link to="/checkout" onClick={() => dispatch(addToCart({ product, quantity, flavor: selectedFlavor }))}
              className="bg-white text-green-950 font-outfit font-bold px-6 py-4 rounded-full hover:bg-cream transition-all hover:scale-105 text-center">
              Buy Now
            </Link>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-2">
            {['🌿 100% Natural', '✋ Handmade', '🚫 No Preservatives', `📦 ${product.shelfLife} shelf life`].map(t => (
              <span key={t} className="tag-pill">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="mb-12">
        <div className="flex gap-1 glass rounded-2xl p-1 mb-8 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-outfit font-semibold transition-all ${activeTab === tab.key ? 'bg-green-600 text-white' : 'text-white/50 hover:text-white'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'nutrition' && (
            <div className="glass rounded-2xl p-6 max-w-md">
              <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-3">
                <span className="font-outfit font-bold text-white text-lg">Nutrition Facts</span>
                <span className="text-white/40 text-sm font-inter">Per {product.nutrition?.servingSize}</span>
              </div>
              {[
                { label: 'Calories', value: `${product.nutrition?.calories} kcal` },
                { label: 'Protein', value: `${product.nutrition?.protein}g` },
                { label: 'Carbohydrates', value: `${product.nutrition?.carbs}g` },
                { label: 'of which Sugars', value: `${product.nutrition?.sugar}g` },
                { label: 'Total Fat', value: `${product.nutrition?.fat}g` },
                { label: 'Dietary Fiber', value: `${product.nutrition?.fiber}g` },
                { label: 'Sodium', value: `${product.nutrition?.sodium}mg` },
              ].map(({ label, value }) => (
                <div key={label} className="nutrition-row">
                  <span className={`font-inter ${label.startsWith('of') ? 'pl-4 text-white/50' : 'text-white/80'}`}>{label}</span>
                  <span className="text-white font-semibold font-outfit">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="flex flex-wrap gap-2">
              {product.ingredients?.map(ing => (
                <span key={ing} className="flex items-center gap-1.5 glass rounded-full px-4 py-2 text-sm text-white/80 font-inter">
                  <FiCheck size={12} className="text-green-400" /> {ing}
                </span>
              ))}
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.benefits?.map(b => (
                <div key={b} className="glass rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center text-green-400 flex-shrink-0">✓</div>
                  <span className="text-white/80 font-inter text-sm">{b}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="glass rounded-2xl p-6 max-w-lg">
              <div className="grid gap-4">
                {[
                  { icon: '📦', label: 'Shelf Life', value: product.shelfLife },
                  { icon: '❄️', label: 'Storage', value: product.storageInstructions },
                  { icon: '⚖️', label: 'Weight', value: product.weight },
                  { icon: '🎯', label: 'Suitable For', value: product.suitableFor?.join(', ') },
                ].map(({ icon, label, value }) => value && (
                  <div key={label} className="flex items-start gap-4">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="text-white/50 text-xs font-outfit uppercase tracking-wider">{label}</p>
                      <p className="text-white font-inter text-sm mt-0.5 capitalize">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── REVIEWS ── */}
      <div className="mb-16">
        <h2 className="font-outfit font-bold text-2xl text-white mb-6">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Review list */}
          <div className="flex flex-col gap-4">
            {reviews.length === 0 ? (
              <p className="text-white/40 font-inter">No reviews yet. Be the first!</p>
            ) : reviews.map(r => (
              <div key={r._id} className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-gold-500 flex items-center justify-center font-bold text-white text-sm">
                      {r.name?.[0]}
                    </div>
                    <div>
                      <p className="text-white font-outfit font-semibold text-sm">{r.name}</p>
                      <p className="text-white/40 text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <FiStar key={s} size={12} fill={s <= r.rating ? 'currentColor' : 'none'}
                        className={s <= r.rating ? 'text-gold-400' : 'text-white/20'} />
                    ))}
                  </div>
                </div>
                <p className="text-white/70 font-inter text-sm leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>

          {/* Write Review */}
          <div className="glass rounded-2xl p-6">
            <h3 className="font-outfit font-semibold text-white mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-white/60 text-sm font-inter mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>
                      <FiStar size={24} fill={s <= reviewForm.rating ? 'currentColor' : 'none'}
                        className={`cursor-pointer transition-colors ${s <= reviewForm.rating ? 'text-gold-400' : 'text-white/30 hover:text-gold-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                placeholder="Share your experience with this product..."
                rows={4}
                className="input-style resize-none"
                required
              />
              <button type="submit" className="btn-primary">{isAuthenticated ? 'Submit Review' : 'Login to Review'}</button>
            </form>
          </div>
        </div>
      </div>

      {/* ── RELATED ── */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-outfit font-bold text-2xl text-white mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
