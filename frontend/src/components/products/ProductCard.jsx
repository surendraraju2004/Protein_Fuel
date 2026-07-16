import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiEye, FiStar, FiZap } from 'react-icons/fi'
import { addToCart } from '../../store/cartSlice'
import { toggleWishlist, selectIsWishlisted } from '../../store/wishlistSlice'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const isWishlisted = useSelector(selectIsWishlisted(product._id))

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price
  const discountPct = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  const handleAddToCart = (e) => {
    e.preventDefault()
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success(`${product.name} added to cart! 🛒`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    dispatch(toggleWishlist(product))
    toast(isWishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist!',
      { icon: isWishlisted ? '🗑️' : '❤️' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="product-card group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-white/5">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400'}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}
            loading="lazy"
          />

          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-green-950/60 flex items-center justify-center gap-3 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={(e) => { e.preventDefault(); navigate(`/products/${product.slug}`) }}
              className="w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
              title="Quick View"
            >
              <FiEye size={16} />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-green-950 hover:bg-gold-400 transition-all hover:scale-110"
              title="Add to Cart"
            >
              <FiShoppingCart size={16} />
            </button>
            <button
              onClick={handleWishlist}
              className={`w-10 h-10 glass rounded-full flex items-center justify-center transition-all hover:scale-110 ${isWishlisted ? 'text-red-400' : 'text-white hover:bg-white/20'}`}
              title="Wishlist"
            >
              <FiHeart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPct > 0 && (
              <span className="badge bg-red-500 text-white text-[10px]">{discountPct}% OFF</span>
            )}
            {product.isBestSeller && (
              <span className="badge bg-gold-500 text-green-950 text-[10px]">⭐ Bestseller</span>
            )}
            {product.isVegan && (
              <span className="badge bg-green-500/80 text-white text-[10px]">🌿 Vegan</span>
            )}
            {product.isKeto && (
              <span className="badge bg-purple-500/80 text-white text-[10px]">Keto</span>
            )}
          </div>

          {/* Wishlist icon top-right always visible */}
          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 glass rounded-full flex items-center justify-center transition-all hover:scale-110 ${isWishlisted ? 'text-red-400' : 'text-white/60'}`}
          >
            <FiHeart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-white/40 text-xs font-outfit uppercase tracking-wider mb-1">
            {product.category?.name || 'Protein Bar'}
          </p>

          {/* Name */}
          <h3 className="font-outfit font-semibold text-white text-base leading-tight mb-2 line-clamp-2 group-hover:text-gold-400 transition-colors">
            {product.name}
          </h3>

          {/* Nutrition Highlights */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1 text-xs text-white/60 font-inter">
              <FiZap size={11} className="text-gold-400" />
              <span>{product.nutrition?.calories || 0} cal</span>
            </div>
            <div className="text-white/20 text-xs">•</div>
            <div className="text-xs text-white/60 font-inter">
              <span className="text-green-400 font-semibold">{product.nutrition?.protein || 0}g</span> protein
            </div>
            <div className="text-white/20 text-xs">•</div>
            <div className="text-xs text-white/60 font-inter">{product.weight}</div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  size={11}
                  className={star <= Math.round(product.ratings) ? 'star-filled' : 'star-empty'}
                  fill={star <= Math.round(product.ratings) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-white/50 text-xs font-inter">({product.numReviews})</span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-outfit font-bold text-white text-lg">
                ₹{effectivePrice}
              </span>
              {discountPct > 0 && (
                <span className="text-white/30 text-sm line-through font-inter">₹{product.price}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-outfit font-semibold px-3 py-2 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              <FiShoppingCart size={12} /> Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
