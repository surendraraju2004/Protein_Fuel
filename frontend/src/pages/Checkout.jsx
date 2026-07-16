import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheck, FiChevronRight } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { selectCartItems, selectCartTotal, selectDiscount, selectCoupon, clearCart } from '../store/cartSlice'
import toast from 'react-hot-toast'
import api from '../api/axios'

const steps = ['Shipping', 'Payment', 'Review']

const paymentMethods = [
  { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { id: 'UPI', label: 'UPI Payment', icon: '📱', sub: 'Google Pay · PhonePe · Paytm' },
  { id: 'CARD', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'NETBANKING', label: 'Net Banking', icon: '🏦' },
]

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const items = useSelector(selectCartItems)
  const total = useSelector(selectCartTotal)
  const discount = useSelector(selectDiscount)
  const coupon = useSelector(selectCoupon)
  const { user } = useSelector(s => s.auth)

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const shipping = (total - discount) > 999 ? 0 : 60
  const finalTotal = total - discount + shipping

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    house: '', street: '', landmark: '', city: '', state: '', pinCode: '',
    deliveryInstructions: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('COD')

  const handleAddressChange = (e) => {
    setAddress(a => ({ ...a, [e.target.name]: e.target.value }))
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    try {
      const orderItems = items.map(i => ({
        product: i.product,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
      }))
      const { data } = await api.post('/orders', {
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
        couponCode: coupon?.code,
      })
      dispatch(clearCart())
      toast.success('🎉 Order placed successfully!')
      navigate(`/order/${data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally { setLoading(false) }
  }

  const isAddressValid = address.fullName && address.phone && address.email &&
    address.house && address.street && address.city && address.state && address.pinCode

  return (
    <div className="pt-24 section-padding py-12 max-w-5xl mx-auto">
      <h1 className="section-title text-white mb-8">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-0 mb-12">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex flex-col items-center gap-1 cursor-pointer`} onClick={() => i < step && setStep(i)}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-outfit font-bold text-sm transition-all ${
                i < step ? 'bg-green-500 text-white' : i === step ? 'bg-gold-500 text-green-950' : 'bg-white/10 text-white/30'
              }`}>
                {i < step ? <FiCheck size={16} /> : i + 1}
              </div>
              <span className={`text-xs font-inter whitespace-nowrap ${i === step ? 'text-gold-400' : i < step ? 'text-green-400' : 'text-white/30'}`}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-16 sm:w-24 mx-1 mb-5 transition-all ${i < step ? 'bg-green-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step Content */}
        <div className="lg:col-span-2">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>

            {/* Step 0 — Shipping */}
            {step === 0 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="font-outfit font-bold text-white text-xl mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'fullName', label: 'Full Name', placeholder: 'Your full name', full: false },
                    { name: 'phone', label: 'Phone Number', placeholder: '10-digit mobile', full: false },
                    { name: 'email', label: 'Email', placeholder: 'your@email.com', full: true },
                    { name: 'house', label: 'House / Flat No.', placeholder: 'Flat 4B, Tower 2', full: false },
                    { name: 'street', label: 'Street / Area', placeholder: 'MG Road, Koregaon Park', full: false },
                    { name: 'landmark', label: 'Landmark (optional)', placeholder: 'Near HDFC Bank', full: false },
                    { name: 'city', label: 'City', placeholder: 'Mumbai', full: false },
                    { name: 'state', label: 'State', placeholder: 'Maharashtra', full: false },
                    { name: 'pinCode', label: 'PIN Code', placeholder: '400001', full: false },
                    { name: 'deliveryInstructions', label: 'Delivery Instructions (optional)', placeholder: 'Leave at door', full: true },
                  ].map(({ name, label, placeholder, full }) => (
                    <div key={name} className={full ? 'col-span-full' : ''}>
                      <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-1.5">{label}</label>
                      <input
                        name={name}
                        value={address[name]}
                        onChange={handleAddressChange}
                        placeholder={placeholder}
                        className="input-style"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { if (isAddressValid) setStep(1); else toast.error('Fill all required fields') }}
                  className="btn-primary mt-6 flex items-center gap-2"
                >
                  Continue to Payment <FiChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="font-outfit font-bold text-white text-xl mb-6">Select Payment Method</h2>
                <div className="flex flex-col gap-3 mb-6">
                  {paymentMethods.map(m => (
                    <label key={m.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === m.id ? 'border-green-500 bg-green-600/10' : 'border-white/10 glass hover:border-white/25'}`}
                    >
                      <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} className="sr-only" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === m.id ? 'border-green-500' : 'border-white/30'}`}>
                        {paymentMethod === m.id && <div className="w-2.5 h-2.5 rounded-full bg-green-400" />}
                      </div>
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <p className="font-outfit font-semibold text-white text-sm">{m.label}</p>
                        {m.sub && <p className="text-white/40 text-xs font-inter">{m.sub}</p>}
                      </div>
                    </label>
                  ))}
                </div>
                {paymentMethod !== 'COD' && (
                  <div className="glass rounded-xl p-4 mb-6 border border-gold-500/20">
                    <p className="text-gold-400 text-sm font-outfit font-semibold mb-1">🔒 Secure Payment</p>
                    <p className="text-white/50 text-xs font-inter">Payment gateway integration is ready. Add Razorpay keys in backend .env to activate live payments.</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-secondary flex-1">← Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 flex items-center justify-center gap-2">
                    Review Order <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <div className="glass rounded-2xl p-6">
                <h2 className="font-outfit font-bold text-white text-xl mb-6">Review Your Order</h2>

                <div className="mb-6">
                  <h3 className="text-white/60 text-xs font-outfit uppercase tracking-wider mb-3">Items</h3>
                  {items.map(item => (
                    <div key={item.product} className="flex items-center gap-3 py-3 border-b border-white/5">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="text-white text-sm font-inter">{item.name}</p>
                        {item.flavor && <p className="text-white/40 text-xs">{item.flavor}</p>}
                      </div>
                      <span className="text-white/60 text-sm">×{item.quantity}</span>
                      <span className="text-white font-outfit font-semibold">₹{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6">
                  <h3 className="text-white/60 text-xs font-outfit uppercase tracking-wider mb-3">Shipping to</h3>
                  <div className="glass rounded-xl p-4 text-sm font-inter text-white/70">
                    <p className="font-semibold text-white">{address.fullName}</p>
                    <p>{address.house}, {address.street}</p>
                    {address.landmark && <p>{address.landmark}</p>}
                    <p>{address.city}, {address.state} — {address.pinCode}</p>
                    <p>📞 {address.phone}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-white/60 text-xs font-outfit uppercase tracking-wider mb-2">Payment</h3>
                  <p className="text-white font-inter text-sm">{paymentMethods.find(m => m.id === paymentMethod)?.label}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Placing Order...' : `Place Order — ₹${finalTotal.toFixed(0)}`}
                    {!loading && <FiCheck size={16} />}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="glass rounded-2xl p-5 sticky top-24">
            <h3 className="font-outfit font-bold text-white mb-4">Summary</h3>
            {items.map(item => (
              <div key={item.product} className="flex justify-between text-sm font-inter py-2 border-b border-white/5">
                <span className="text-white/60 truncate flex-1">{item.name} ×{item.quantity}</span>
                <span className="text-white ml-2 flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</span>
              </div>
            ))}
            <div className="mt-4 flex flex-col gap-2 text-sm font-inter">
              <div className="flex justify-between"><span className="text-white/60">Subtotal</span><span className="text-white">₹{total.toFixed(0)}</span></div>
              {discount > 0 && <div className="flex justify-between text-green-400"><span>Coupon</span><span>−₹{discount}</span></div>}
              <div className="flex justify-between"><span className="text-white/60">Shipping</span><span className={shipping === 0 ? 'text-green-400' : 'text-white'}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-outfit font-bold text-white">
                <span>Total</span><span className="text-gold-400 text-lg">₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
