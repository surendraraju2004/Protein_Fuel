import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSearch, FiMail, FiPhone, FiUser, FiShoppingBag, FiStar, FiMessageCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import Loader from '../../components/ui/Loader'

export default function AdminCustomers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/users')
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load customers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = search
    ? users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
      )
    : users

  const regularUsers = filtered.filter(u => u.role !== 'admin')

  return (
    <div className="pt-24 section-padding py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-outfit font-bold text-3xl text-white">
            Customers <span className="text-gradient-gold">Directory</span>
          </h1>
          <p className="text-white/40 text-sm font-inter mt-1">
            {regularUsers.length} registered customers
          </p>
        </div>
        <Link to="/admin" className="btn-secondary text-sm px-4 py-2">← Dashboard</Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email or phone..."
          className="input-style pl-10" />
      </div>

      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {regularUsers.length === 0 && (
            <div className="col-span-3 text-center py-16 text-white/30 font-inter">No customers found</div>
          )}
          {regularUsers.map((user, i) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-5 border border-white/10 hover:border-green-500/30 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-outfit font-black text-lg flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #1a5c40, #2d6a4f)' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-outfit font-semibold truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5 text-white/50 text-xs font-inter mt-0.5">
                    <FiMail size={11} /> <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1.5 text-white/50 text-xs font-inter mt-0.5">
                      <FiPhone size={11} /> {user.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-gold-400 font-outfit font-bold text-sm">{user.loyaltyPoints || 0}</p>
                  <p className="text-white/40 text-xs font-inter">Points</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-outfit font-bold text-sm">{user.addresses?.length || 0}</p>
                  <p className="text-white/40 text-xs font-inter">Addresses</p>
                </div>
                <div className="text-center">
                  <p className="text-white/70 font-outfit font-bold text-sm capitalize">{user.goal?.replace('-', ' ') || '—'}</p>
                  <p className="text-white/40 text-xs font-inter">Goal</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                {user.phone && (
                  <a href={`https://wa.me/91${user.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] rounded-xl py-2 text-xs font-outfit font-semibold transition-all">
                    <FiMessageCircle size={12} /> WhatsApp
                  </a>
                )}
                <a href={`mailto:${user.email}`}
                  className="flex-1 flex items-center justify-center gap-1.5 glass hover:bg-white/10 border border-white/10 text-white/60 rounded-xl py-2 text-xs font-outfit font-semibold transition-all">
                  <FiMail size={12} /> Email
                </a>
              </div>

              {/* Diet + referral */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {user.dietPreference && user.dietPreference !== '' && (
                  <span className="badge bg-green-500/15 text-green-400 border border-green-500/25 text-[10px] capitalize">
                    {user.dietPreference}
                  </span>
                )}
                {user.newsletterSubscribed && (
                  <span className="badge bg-gold-500/15 text-gold-400 border border-gold-500/25 text-[10px]">
                    Newsletter ✓
                  </span>
                )}
                {user.referralCode && (
                  <span className="badge bg-blue-500/15 text-blue-400 border border-blue-500/25 text-[10px]">
                    {user.referralCode}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
