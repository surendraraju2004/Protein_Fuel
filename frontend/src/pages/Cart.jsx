import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiTrash2, FiPlus, FiMinus, FiTag, FiArrowRight, FiShoppingBag, FiGift } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectCartItems, selectCartTotal, selectCartCount, selectDiscount, selectCoupon,
  removeFromCart, updateQuantity, applyCoupon, removeCoupon
} from '../store/cartSlice'
import toast from 'react-hot-toast'
import api from '../api/axios'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const count = useSelector(selectCartCount)
  const discount = useSelector(selectDiscount)
  const coupon = useSelector(selectCoupon)
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const { isAuthenticated } = useSelector(s => s.auth)

  const shipping = (total - discount) > 999 ? 0 : 60
  const finalTotal = total - discount + shipping

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    if (!isAuthenticated) { toast.error('Please login to use coupons'); return }
    setCouponLoading(true)
    try {
      const { data } = await api.post('/coupon/validate', { code: couponCode, orderAmount: total })
      dispatch(applyCoupon(data))
      toast.success(`✅ Coupon applied! You save ₹${data.discountAmount}`)
      setCouponCode('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon')
    } finally { setCouponLoading(false) }
  }

  if (items.length === 0) {
    return (
      <div className="pt-28 section-padding flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="font-outfit font-bold text-2xl text-white mb-3">Your cart is empty</h2>
          <p className="text-white/50 font-inter mb-8">Discover our premium protein bars and fuel your day!</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingBag size={18} /> Start Shopping
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-24 section-padding py-12">
      <h1 className="section-title text-white mb-2">Your <span className="text-gradient-gold">Cart</span></h1>
      <p className="text-white/50 font-inter mb-8">{count} item{count !== 1 ? 's' : ''}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item, i) => (
            <motion.div
              key={`${item.product}-${item.flavor}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 flex items-center gap-4"
            >
              <Link to={`/products/${item.slug}`}>
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=200'}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.slug}`}>
                  <h3 className="font-outfit font-semibold text-white text-sm sm:text-base truncate hover:text-gold-400 transition-colors">
                    {item.name}
                  </h3>
                </Link>
                {item.flavor && <p className="text-white/50 text-xs font-inter mt-0.5">Flavor: {item.flavor}</p>}
                <p className="text-gold-400 font-outfit font-bold text-base mt-1">₹{item.price}</p>
              </div>

              {/* Qty */}
              <div className="flex items-center glass rounded-xl overflow-hidden">
                <button
                  onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity - 1 }))}
                  className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <FiMinus size={12} />
                </button>
                <span className="w-8 text-center font-outfit font-semibold text-white text-sm">{item.quantity}</span>
                <button
                  onClick={() => dispatch(updateQuantity({ productId: item.product, quantity: item.quantity + 1 }))}
                  className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <FiPlus size={12} />
                </button>
              </div>

              <span className="font-outfit font-bold text-white text-base min-w-[60px] text-right">
                ₹{(item.price * item.quantity).toFixed(0)}
              </span>

              <button
                onClick={() => { dispatch(removeFromCart(item.product)); toast.success('Item removed') }}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
              >
                <FiTrash2 size={16} />
              </button>
            </motion.div>
          ))}

          {/* Gift Wrap */}
          <div className="glass rounded-2xl p-4 flex items-center gap-4 border border-gold-500/10">
            <FiGift size={20} className="text-gold-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-outfit font-semibold text-white text-sm">Gift Wrapping</p>
              <p className="text-white/50 text-xs font-inter">Add premium gift wrapping for ₹49</p>
            </div>
            <button className="btn-secondary text-xs px-4 py-2">Add</button>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h3 className="font-outfit font-bold text-white text-lg mb-6">Order Summary</h3>

            {/* Coupon */}
            <div className="mb-6">
              {coupon ? (
                <div className="flex items-center justify-between glass rounded-xl px-4 py-3 border border-green-600/30">
                  <div className="flex items-center gap-2">
                    <FiTag size={14} className="text-green-400" />
                    <span className="text-green-400 font-outfit font-semibold text-sm">{coupon.code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm font-inter">−₹{coupon.discountAmount}</span>
                    <button onClick={() => dispatch(removeCoupon())} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="input-style flex-1 text-sm"
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 rounded-xl font-outfit font-semibold text-sm transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              <p className="text-white/30 text-xs font-inter mt-2">Try: WELCOME20 · SAVE50 · PROTEIN10</p>
            </div>

            {/* Price Breakdown */}
            <div className="flex flex-col gap-3 mb-6 text-sm font-inter">
              <div className="flex justify-between">
                <span className="text-white/60">Subtotal ({count} items)</span>
                <span className="text-white">₹{total.toFixed(0)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Coupon Discount</span>
                  <span>−₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/60">Shipping</span>
                <span className={shipping === 0 ? 'text-green-400' : 'text-white'}>
                  {shipping === 0 ? 'FREE 🎉' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-white/30 text-xs">Add ₹{(999 - total + discount).toFixed(0)} more for free shipping</p>
              )}
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="font-outfit font-bold text-white">Total</span>
                <span className="font-outfit font-black text-2xl text-white">₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Checkout */}
            <button
              onClick={() => { isAuthenticated ? navigate('/checkout') : navigate('/login') }}
              className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-base"
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              <FiArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center gap-3 mt-4 text-white/30 text-xs font-inter">
              <span>🔒 Secure Checkout</span>
              <span>·</span>
              <span>💳 UPI · Cards · COD</span>
            </div>

            <Link to="/products" className="block text-center text-white/40 hover:text-gold-400 text-sm font-inter mt-4 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
