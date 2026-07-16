import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { FiUser, FiPackage, FiHeart, FiStar, FiMapPin, FiEdit2, FiLogOut, FiGift, FiCalendar } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { logout, updateUser } from '../store/authSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import Loader from '../components/ui/Loader'
import { selectWishlist } from '../store/wishlistSlice'
import ProductCard from '../components/products/ProductCard'

const tabs = [
  { key: 'profile', label: 'Profile', icon: <FiUser size={16} /> },
  { key: 'orders', label: 'Orders', icon: <FiPackage size={16} /> },
  { key: 'wishlist', label: 'Wishlist', icon: <FiHeart size={16} /> },
  { key: 'loyalty', label: 'Loyalty Points', icon: <FiGift size={16} /> },
  { key: 'addresses', label: 'Addresses', icon: <FiMapPin size={16} /> },
  { key: 'subscriptions', label: 'Subscriptions', icon: <FiCalendar size={16} /> },
]

const statusColors = {
  Pending: 'badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  Confirmed: 'badge bg-blue-500/20 text-blue-400 border border-blue-500/30',
  Packed: 'badge bg-purple-500/20 text-purple-400 border border-purple-500/30',
  Shipped: 'badge bg-gold-500/20 text-gold-400 border border-gold-500/30',
  Delivered: 'badge bg-green-500/20 text-green-400 border border-green-500/30',
  Cancelled: 'badge bg-red-500/20 text-red-400 border border-red-500/30',
}

export default function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'profile'
  const { user } = useSelector(s => s.auth)
  const wishlist = useSelector(selectWishlist)

  const [orders, setOrders] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [editingProfile, setEditingProfile] = useState(false)

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoading(true)
      api.get('/orders/myorders').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false))
    }
    if (activeTab === 'subscriptions') {
      api.get('/subscription/my').then(r => setSubscriptions(r.data)).catch(() => {})
    }
  }, [activeTab])

  const setTab = (tab) => setSearchParams({ tab })

  const handleProfileSave = async () => {
    try {
      const { data } = await api.put('/users/profile', profileForm)
      dispatch(updateUser(data))
      toast.success('Profile updated!')
      setEditingProfile(false)
    } catch { toast.error('Update failed') }
  }

  const handleLogout = () => { dispatch(logout()); navigate('/') }

  return (
    <div className="pt-24 section-padding py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-outfit font-bold text-3xl text-white">
            My <span className="text-gradient-gold">Account</span>
          </h1>
          <p className="text-white/50 font-inter text-sm">Welcome back, {user?.name?.split(' ')[0]}!</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 glass rounded-xl px-4 py-2 text-red-400 hover:bg-red-500/10 text-sm font-inter transition-all">
          <FiLogOut size={15} /> Sign Out
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="glass rounded-2xl p-4">
            {/* Avatar */}
            <div className="text-center mb-6 pb-6 border-b border-white/10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-gold-500 flex items-center justify-center text-white font-outfit font-black text-2xl mx-auto mb-3">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <p className="font-outfit font-semibold text-white text-sm">{user?.name}</p>
              <p className="text-white/40 text-xs font-inter truncate">{user?.email}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <FiGift size={12} className="text-gold-400" />
                <span className="text-gold-400 text-xs font-outfit font-semibold">{user?.loyaltyPoints || 0} pts</span>
              </div>
            </div>

            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-inter transition-all mb-1 ${
                  activeTab === tab.key ? 'bg-green-600/20 text-gold-400 font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            {/* ── PROFILE ── */}
            {activeTab === 'profile' && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-outfit font-bold text-white text-xl">Personal Information</h2>
                  <button onClick={() => setEditingProfile(!editingProfile)} className="flex items-center gap-2 badge-green cursor-pointer hover:bg-green-600/30 transition-colors">
                    <FiEdit2 size={12} /> {editingProfile ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {editingProfile ? (
                  <div className="flex flex-col gap-4 max-w-md">
                    <div>
                      <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-1.5">Full Name</label>
                      <input value={profileForm.name} onChange={e => setProfileForm(f => ({...f, name: e.target.value}))} className="input-style" />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-1.5">Phone</label>
                      <input value={profileForm.phone} onChange={e => setProfileForm(f => ({...f, phone: e.target.value}))} className="input-style" />
                    </div>
                    <button onClick={handleProfileSave} className="btn-primary w-fit">Save Changes</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', value: user?.name },
                      { label: 'Email', value: user?.email },
                      { label: 'Phone', value: user?.phone || 'Not set' },
                      { label: 'Account Type', value: user?.role === 'admin' ? '👑 Admin' : '👤 Customer' },
                      { label: 'Loyalty Points', value: `🎁 ${user?.loyaltyPoints || 0} points` },
                      { label: 'Referral Code', value: user?.referralCode || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} className="glass rounded-xl p-4">
                        <p className="text-white/40 text-xs font-outfit uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-white font-inter text-sm font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── ORDERS ── */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-outfit font-bold text-white text-xl mb-6">My Orders</h2>
                {loading ? <Loader /> : orders.length === 0 ? (
                  <div className="glass rounded-2xl p-12 text-center">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-white/50 font-inter">No orders yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map(order => (
                      <div key={order._id} className="glass rounded-2xl p-5">
                        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                          <div>
                            <p className="font-outfit font-bold text-white">{order.orderId}</p>
                            <p className="text-white/40 text-xs font-inter">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={statusColors[order.status] || 'badge-gold'}>{order.status}</span>
                            <span className="font-outfit font-bold text-white">₹{order.totalPrice}</span>
                          </div>
                        </div>
                        <div className="flex gap-3 flex-wrap mb-4">
                          {order.items.map(item => (
                            <div key={item._id} className="flex items-center gap-2 glass rounded-xl px-3 py-2">
                              <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                              <span className="text-white/70 text-xs font-inter">{item.name} ×{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <a href={`/order/${order._id}`} className="text-gold-400 hover:text-gold-300 text-sm font-inter transition-colors">View Details →</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── WISHLIST ── */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-outfit font-bold text-white text-xl mb-6">My Wishlist ({wishlist.length})</h2>
                {wishlist.length === 0 ? (
                  <div className="glass rounded-2xl p-12 text-center">
                    <div className="text-5xl mb-4">❤️</div>
                    <p className="text-white/50 font-inter">Your wishlist is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {wishlist.map(p => <ProductCard key={p._id} product={p} />)}
                  </div>
                )}
              </div>
            )}

            {/* ── LOYALTY ── */}
            {activeTab === 'loyalty' && (
              <div className="glass rounded-2xl p-6">
                <h2 className="font-outfit font-bold text-white text-xl mb-6">Loyalty Points</h2>
                <div className="text-center glass rounded-2xl p-8 mb-6 border border-gold-500/20">
                  <div className="text-6xl mb-3">🎁</div>
                  <div className="font-outfit font-black text-5xl text-gold-400">{user?.loyaltyPoints || 0}</div>
                  <div className="text-white/60 font-inter mt-1">Total Points Earned</div>
                  <div className="text-white/40 font-inter text-sm mt-2">≈ ₹{Math.floor((user?.loyaltyPoints || 0) / 10)} discount value</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: '🛒', label: 'Earn on Purchases', desc: '1 point per ₹10 spent' },
                    { icon: '⭐', label: 'Earn on Reviews', desc: '10 points per review' },
                    { icon: '🎂', label: 'Birthday Bonus', desc: '50 points on your birthday' },
                  ].map(({ icon, label, desc }) => (
                    <div key={label} className="glass rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">{icon}</div>
                      <p className="text-white font-outfit font-semibold text-sm">{label}</p>
                      <p className="text-white/40 text-xs font-inter mt-1">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SUBSCRIPTIONS ── */}
            {activeTab === 'subscriptions' && (
              <div>
                <h2 className="font-outfit font-bold text-white text-xl mb-6">My Subscriptions</h2>
                {subscriptions.length === 0 ? (
                  <div className="glass rounded-2xl p-12 text-center">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-white/50 font-inter mb-4">No active subscriptions</p>
                    <a href="/subscription" className="btn-primary inline-block">View Plans</a>
                  </div>
                ) : subscriptions.map(sub => (
                  <div key={sub._id} className="glass rounded-2xl p-5 mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-outfit font-bold text-white capitalize">{sub.plan} Plan</p>
                        <p className="text-white/40 text-xs font-inter">Next delivery: {new Date(sub.nextDeliveryDate).toLocaleDateString('en-IN')}</p>
                      </div>
                      <span className={`badge ${sub.status === 'active' ? 'badge-green' : 'badge-gold'}`}>{sub.status}</span>
                    </div>
                    <p className="text-gold-400 font-outfit font-bold">₹{sub.totalPrice} <span className="text-white/40 font-normal text-sm">({sub.discount}% off)</span></p>
                  </div>
                ))}
              </div>
            )}

            {/* ── ADDRESSES ── */}
            {activeTab === 'addresses' && (
              <div className="glass rounded-2xl p-6">
                <h2 className="font-outfit font-bold text-white text-xl mb-6">Saved Addresses</h2>
                <p className="text-white/40 font-inter text-sm">Addresses are saved when you complete an order.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
