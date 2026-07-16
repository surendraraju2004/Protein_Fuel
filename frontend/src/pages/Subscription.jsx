import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiArrowRight } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const plans = [
  {
    id: 'weekly', label: 'Weekly', icon: '📦', discount: 15, deliveryDay: 'Every Monday',
    price: 'Best for gym lovers & daily snackers',
    features: ['Fresh delivery every week', 'Mix & match products', '15% discount', 'Free shipping', 'Cancel anytime'],
  },
  {
    id: 'biweekly', label: 'Biweekly', icon: '🗓️', discount: 10, deliveryDay: 'Every 2 weeks',
    price: 'Perfect for office & family packs',
    popular: true,
    features: ['Delivery every 2 weeks', 'Mix & match products', '10% discount', 'Free shipping', 'Cancel anytime'],
  },
  {
    id: 'monthly', label: 'Monthly', icon: '📅', discount: 8, deliveryDay: 'Every 1st of month',
    price: 'Great for budget-conscious shoppers',
    features: ['Once-a-month delivery', 'Mix & match products', '8% discount', 'Free shipping', 'Cancel anytime'],
  },
]

const whySubscribe = [
  { icon: '💰', title: 'Save Money', desc: 'Up to 15% off every order, automatically applied.' },
  { icon: '🚚', title: 'Free Shipping', desc: 'All subscription orders delivered for free.' },
  { icon: '🔄', title: 'Flexible', desc: 'Skip, pause, or cancel anytime. No commitment.' },
  { icon: '🎁', title: 'Exclusive Perks', desc: 'Subscriber-only flavors and early product access.' },
]

export default function Subscription() {
  const { isAuthenticated } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('biweekly')
  const [quantity, setQuantity] = useState(4)
  const [loading, setLoading] = useState(false)

  const plan = plans.find(p => p.id === selectedPlan)
  const basePrice = quantity * 149 // ₹149 per bar
  const discountedPrice = Math.round(basePrice * (1 - plan.discount / 100))

  const handleSubscribe = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setLoading(true)
    try {
      await api.post('/subscription/create', { plan: selectedPlan, quantity, totalPrice: discountedPrice, discount: plan.discount })
      toast.success('🎉 Subscription activated!')
      navigate('/dashboard?tab=subscriptions')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="pt-24 section-padding py-16">
      {/* Hero */}
      <div className="text-center mb-14">
        <span className="badge-gold mb-4 inline-block">Subscribe & Save</span>
        <h1 className="section-title text-white mb-4">
          Never Run Out of <span className="text-gradient-gold">NutriBite</span>
        </h1>
        <p className="section-subtitle mx-auto text-center">
          Get your favourite protein bars delivered on a schedule. Save up to 15%, always free shipping.
        </p>
      </div>

      {/* Why Subscribe */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-16">
        {whySubscribe.map((w, i) => (
          <motion.div key={w.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5 text-center">
            <div className="text-3xl mb-3">{w.icon}</div>
            <p className="font-outfit font-bold text-white text-sm mb-1">{w.title}</p>
            <p className="text-white/50 text-xs font-inter">{w.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan, i) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <button onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left p-6 rounded-3xl border-2 transition-all duration-300 relative ${
                selectedPlan === plan.id ? 'border-gold-500 bg-gold-500/5 shadow-glow-gold' : 'border-white/10 glass hover:border-white/25'
              }`}>
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-gold-500 text-green-950 text-[11px]">Most Popular</span>
              )}
              <div className="text-4xl mb-4">{plan.icon}</div>
              <h3 className="font-outfit font-black text-white text-xl mb-1">{plan.label}</h3>
              <div className="badge-green mb-4 inline-block text-[11px]">{plan.discount}% OFF</div>
              <p className="text-white/50 text-xs font-inter mb-4">{plan.price}</p>
              <p className="text-white/40 text-xs font-inter mb-4">📅 {plan.deliveryDay}</p>
              <ul className="flex flex-col gap-2">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm font-inter text-white/70">
                    <FiCheck size={13} className="text-green-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-gold-500 bg-gold-500' : 'border-white/30'}`}>
                {selectedPlan === plan.id && <div className="w-2 h-2 rounded-full bg-green-950" />}
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Order Config */}
      <div className="max-w-2xl mx-auto glass rounded-3xl p-8 border border-gold-500/20">
        <h2 className="font-outfit font-bold text-white text-xl mb-6">Configure Your Subscription</h2>

        <div className="mb-6">
          <label className="text-white/60 text-sm font-outfit mb-3 block">Bars Per Delivery: <span className="text-gold-400 font-bold">{quantity} bars</span></label>
          <input type="range" min={1} max={20} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between text-white/30 text-xs font-inter mt-1">
            <span>1 bar</span><span>20 bars</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 mb-6 border border-white/10">
          <div className="flex justify-between text-sm font-inter mb-2">
            <span className="text-white/60">{quantity} bars × ₹149</span>
            <span className="text-white line-through">₹{basePrice}</span>
          </div>
          <div className="flex justify-between text-sm font-inter mb-2">
            <span className="text-green-400">{plans.find(p => p.id === selectedPlan)?.discount}% subscription discount</span>
            <span className="text-green-400">−₹{basePrice - discountedPrice}</span>
          </div>
          <div className="flex justify-between text-sm font-inter mb-2">
            <span className="text-white/60">Shipping</span>
            <span className="text-green-400">FREE 🎉</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between font-outfit font-bold">
            <span className="text-white">Per Delivery</span>
            <span className="text-gold-400 text-2xl">₹{discountedPrice}</span>
          </div>
        </div>

        <button onClick={handleSubscribe} disabled={loading}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base disabled:opacity-50">
          {loading ? 'Activating...' : <><FiArrowRight size={18} /> {isAuthenticated ? 'Subscribe Now' : 'Login to Subscribe'}</>}
        </button>
        <p className="text-white/30 text-xs font-inter text-center mt-3">Cancel anytime · No lock-in period · Auto-renews</p>
      </div>
    </div>
  )
}
