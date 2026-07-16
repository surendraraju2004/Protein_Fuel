import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiClock } from 'react-icons/fi'
import api from '../api/axios'
import Loader from '../components/ui/Loader'

const statusSteps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered']
const statusIcons = ['🕐', '✅', '📦', '🚚', '🏠']

export default function OrderConfirmation() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="pt-28"><Loader text="Loading order..." /></div>
  if (!order) return (
    <div className="pt-28 text-center">
      <p className="text-white/50">Order not found.</p>
      <Link to="/dashboard" className="btn-primary mt-4 inline-block">Go to Orders</Link>
    </div>
  )

  const currentStepIdx = statusSteps.indexOf(order.status)

  return (
    <div className="pt-24 section-padding py-12 max-w-3xl mx-auto">
      {/* Success Header */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-12">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/40">
          <FiCheckCircle size={36} className="text-green-400" />
        </div>
        <h1 className="font-outfit font-black text-4xl text-white mb-2">Order Placed! 🎉</h1>
        <p className="text-white/60 font-inter">
          Thank you! Your order <span className="text-gold-400 font-semibold">{order.orderId}</span> has been confirmed.
        </p>
      </motion.div>

      {/* Status Timeline */}
      <div className="glass rounded-3xl p-8 mb-8">
        <h2 className="font-outfit font-bold text-white text-xl mb-8">Order Status</h2>
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-gold-500 rounded-full transition-all duration-700"
              style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="flex justify-between relative z-10">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2 text-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all
                  ${i <= currentStepIdx ? 'bg-green-600 border-green-500 shadow-glow-green' :
                    i === currentStepIdx + 1 ? 'border-gold-500 bg-gold-500/10 animate-pulse' :
                    'border-white/20 bg-white/5'}`}>
                  {statusIcons[i]}
                </div>
                <span className={`text-xs font-outfit font-medium hidden sm:block ${
                  i <= currentStepIdx ? 'text-green-400' :
                  i === currentStepIdx + 1 ? 'text-gold-400' : 'text-white/30'
                }`}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status History */}
        {order.statusHistory?.length > 0 && (
          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="text-white/60 text-xs font-outfit uppercase tracking-wider mb-4">Timeline</h3>
            {order.statusHistory.map((h, i) => (
              <div key={i} className="flex items-start gap-3 mb-3">
                <div className="order-step-dot done mt-1" />
                <div>
                  <p className="text-white font-outfit font-semibold text-sm">{h.status}</p>
                  {h.note && <p className="text-white/50 text-xs font-inter">{h.note}</p>}
                  <p className="text-white/30 text-xs font-inter">{new Date(h.timestamp).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Items */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-outfit font-bold text-white mb-4 flex items-center gap-2">
            <FiPackage className="text-gold-400" /> Items Ordered
          </h3>
          {order.items.map(item => (
            <div key={item._id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-white text-sm font-inter">{item.name}</p>
                <p className="text-white/40 text-xs">×{item.quantity}</p>
              </div>
              <span className="text-white font-outfit font-semibold text-sm">₹{(item.price * item.quantity).toFixed(0)}</span>
            </div>
          ))}
        </div>

        {/* Shipping + Payment */}
        <div className="flex flex-col gap-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="font-outfit font-bold text-white mb-3 flex items-center gap-2">
              <FiTruck className="text-gold-400" /> Delivery Address
            </h3>
            <div className="text-sm font-inter text-white/70 space-y-0.5">
              <p className="font-semibold text-white">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.house}, {order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pinCode}</p>
              <p className="text-white/50 mt-1">📞 {order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="font-outfit font-bold text-white mb-3">Price Summary</h3>
            <div className="text-sm font-inter space-y-2">
              <div className="flex justify-between"><span className="text-white/60">Items Total</span><span className="text-white">₹{order.itemsPrice}</span></div>
              <div className="flex justify-between"><span className="text-white/60">Shipping</span><span className={order.shippingPrice === 0 ? 'text-green-400' : 'text-white'}>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
              <div className="flex justify-between font-outfit font-bold border-t border-white/10 pt-2 text-base">
                <span className="text-white">Total Paid</span>
                <span className="text-gold-400">₹{order.totalPrice}</span>
              </div>
              <p className="text-white/40 text-xs">Payment: {order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link to="/products" className="btn-primary">Shop More</Link>
        <Link to="/dashboard?tab=orders" className="btn-secondary">View All Orders</Link>
      </div>
    </div>
  )
}
