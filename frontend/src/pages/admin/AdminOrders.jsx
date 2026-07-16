import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiChevronDown, FiChevronUp, FiPhone, FiMail,
  FiMapPin, FiCheck, FiX, FiMessageCircle, FiPackage, FiClock, FiTruck, FiHome
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import Loader from '../../components/ui/Loader'

const STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']

const STATUS_META = {
  Pending:   { color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30', icon: <FiClock size={12}/> },
  Confirmed: { color: 'text-blue-400',   bg: 'bg-blue-500/15 border-blue-500/30',     icon: <FiCheck size={12}/> },
  Packed:    { color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30', icon: <FiPackage size={12}/> },
  Shipped:   { color: 'text-gold-400',   bg: 'bg-gold-500/15 border-gold-500/30',     icon: <FiTruck size={12}/> },
  Delivered: { color: 'text-green-400',  bg: 'bg-green-500/15 border-green-500/30',   icon: <FiHome size={12}/> },
  Cancelled: { color: 'text-red-400',    bg: 'bg-red-500/15 border-red-500/30',       icon: <FiX size={12}/> },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.Pending
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-outfit font-semibold border ${m.color} ${m.bg}`}>
      {m.icon}{status}
    </span>
  )
}

function OrderDetailPanel({ order, onStatusChange, updating }) {
  const [noteText, setNoteText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(order.status)

  const handleUpdate = async () => {
    await onStatusChange(order._id, selectedStatus, noteText)
    setNoteText('')
  }

  const whatsappLink = order.shippingAddress?.phone
    ? `https://wa.me/91${order.shippingAddress.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.shippingAddress.fullName}! Your NutriBite order #${order.orderId} has been confirmed and is being prepared. 🥜✨`)}`
    : null

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <td colSpan={8} className="px-4 py-0">
        <div className="mb-4 mt-1 glass rounded-2xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/10">

            {/* ── Items ── */}
            <div className="p-5">
              <p className="text-white/40 text-xs font-outfit uppercase tracking-wider mb-3">Order Items</p>
              <div className="flex flex-col gap-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.image || item.product?.images?.[0] || 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=80'}
                      alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-inter font-medium truncate">{item.name}</p>
                      {item.flavor && <p className="text-white/40 text-xs">Flavor: {item.flavor}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-outfit font-bold">₹{item.price}</p>
                      <p className="text-white/40 text-xs">×{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-1">
                <div className="flex justify-between text-xs text-white/50 font-inter">
                  <span>Items Total</span><span>₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-xs text-white/50 font-inter">
                  <span>Shipping</span>
                  <span>{order.shippingPrice === 0 ? <span className="text-green-400">FREE</span> : `₹${order.shippingPrice}`}</span>
                </div>
                <div className="flex justify-between text-sm text-white font-outfit font-bold mt-1 pt-1 border-t border-white/10">
                  <span>Total</span><span className="text-gold-400">₹{order.totalPrice}</span>
                </div>
                <div className="flex justify-between text-xs text-white/50 font-inter mt-1">
                  <span>Payment</span><span className="text-white/70">{order.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* ── Customer & Address ── */}
            <div className="p-5">
              <p className="text-white/40 text-xs font-outfit uppercase tracking-wider mb-3">Customer Details</p>
              <div className="flex flex-col gap-2 mb-4">
                <p className="text-white font-outfit font-semibold">{order.user?.name || order.shippingAddress?.fullName}</p>
                {order.user?.email && (
                  <div className="flex items-center gap-2 text-white/60 text-sm font-inter">
                    <FiMail size={13}/> {order.user.email}
                  </div>
                )}
                {order.shippingAddress?.phone && (
                  <div className="flex items-center gap-2 text-white/60 text-sm font-inter">
                    <FiPhone size={13}/> {order.shippingAddress.phone}
                  </div>
                )}
              </div>
              <p className="text-white/40 text-xs font-outfit uppercase tracking-wider mb-2">Shipping Address</p>
              <div className="flex gap-2">
                <FiMapPin size={13} className="text-white/30 flex-shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm font-inter leading-relaxed">
                  {order.shippingAddress?.house}, {order.shippingAddress?.street}
                  {order.shippingAddress?.landmark && `, ${order.shippingAddress.landmark}`}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
                </p>
              </div>

              {/* WhatsApp Button */}
              {whatsappLink && (
                <a href={whatsappLink} target="_blank" rel="noreferrer"
                  className="mt-4 flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] rounded-xl px-4 py-2.5 text-sm font-outfit font-semibold transition-all">
                  <FiMessageCircle size={15} /> WhatsApp Customer
                </a>
              )}
            </div>

            {/* ── Update Status ── */}
            <div className="p-5">
              <p className="text-white/40 text-xs font-outfit uppercase tracking-wider mb-3">Update Status</p>

              {/* Status flow */}
              <div className="flex flex-col gap-2 mb-4">
                {STATUSES.map(s => (
                  <button key={s} onClick={() => setSelectedStatus(s)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-inter transition-all border text-left ${
                      selectedStatus === s
                        ? `${STATUS_META[s].bg} ${STATUS_META[s].color} border-opacity-60`
                        : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
                    }`}>
                    <span className={selectedStatus === s ? STATUS_META[s].color : 'text-white/20'}>
                      {STATUS_META[s].icon}
                    </span>
                    {s}
                    {order.status === s && <span className="ml-auto text-[10px] opacity-60">(current)</span>}
                  </button>
                ))}
              </div>

              <div className="mb-3">
                <label className="text-white/40 text-xs font-outfit block mb-1.5">Note for customer (optional)</label>
                <input value={noteText} onChange={e => setNoteText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500 transition-all"
                  placeholder="e.g. Out for delivery..." />
              </div>

              <button onClick={handleUpdate} disabled={updating || selectedStatus === order.status}
                className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                {updating ? '⏳ Updating...' : <><FiCheck size={14}/> Confirm Update</>}
              </button>
            </div>
          </div>
        </div>
      </td>
    </motion.tr>
  )
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterStatus, setFilterStatus] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ page, limit: 20, ...(filterStatus && { status: filterStatus }) }).toString()
      const { data } = await api.get(`/orders?${q}`)
      setOrders(data.orders)
      setTotalPages(data.pages)
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [page, filterStatus])

  const handleStatusChange = async (orderId, status, note = '') => {
    setUpdatingId(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { status, note })
      toast.success(`✅ Order marked as ${status}`)
      fetchOrders()
    } catch { toast.error('Update failed') }
    finally { setUpdatingId(null) }
  }

  const pendingCount = orders.filter(o => o.status === 'Pending').length

  const filteredOrders = search
    ? orders.filter(o =>
        o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(search.toLowerCase())
      )
    : orders

  return (
    <div className="pt-24 section-padding py-12 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-outfit font-bold text-3xl text-white">
            Orders <span className="text-gradient-gold">Management</span>
          </h1>
          <p className="text-white/40 text-sm font-inter mt-1">
            View, confirm and manage customer orders
            {pendingCount > 0 && (
              <span className="ml-2 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-outfit px-2 py-0.5 rounded-full">
                {pendingCount} pending
              </span>
            )}
          </p>
        </div>
        <Link to="/admin" className="btn-secondary text-sm px-4 py-2">← Dashboard</Link>
      </div>

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative">
          <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search order / customer..."
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-green-500 transition-all w-52" />
        </div>
        <button onClick={() => { setFilterStatus(''); setPage(1) }}
          className={`px-4 py-2 rounded-xl text-sm font-inter border transition-all ${!filterStatus ? 'bg-green-600/20 border-green-500 text-gold-400' : 'glass border-white/10 text-white/60 hover:border-white/30'}`}>
          All
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); setPage(1) }}
            className={`px-4 py-2 rounded-xl text-sm font-inter border transition-all ${filterStatus === s ? `${STATUS_META[s].bg} ${STATUS_META[s].color}` : 'glass border-white/10 text-white/60 hover:border-white/30'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  {['', 'Order ID', 'Customer', 'Items', 'Total', 'Date', 'Status', 'Quick Actions'].map(h => (
                    <th key={h} className="px-4 py-4 text-white/40 text-xs font-outfit uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-16 text-white/30 font-inter">No orders found</td></tr>
                )}
                <AnimatePresence>
                  {filteredOrders.map(order => (
                    <>
                      <tr key={order._id}
                        className={`border-b border-white/5 transition-colors cursor-pointer ${expandedId === order._id ? 'bg-green-900/20' : 'hover:bg-white/[0.03]'}`}
                        onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                      >
                        <td className="px-4 py-4">
                          <div className={`transition-transform duration-200 text-white/30 ${expandedId === order._id ? 'rotate-180' : ''}`}>
                            <FiChevronDown size={16} />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-gold-400 font-outfit font-semibold text-sm">{order.orderId}</p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-white font-inter text-sm">{order.user?.name}</p>
                          <p className="text-white/40 text-xs">{order.user?.email}</p>
                        </td>
                        <td className="px-4 py-4 text-white/60 text-sm font-inter">{order.items?.length} item(s)</td>
                        <td className="px-4 py-4 text-white font-outfit font-bold text-sm">₹{order.totalPrice}</td>
                        <td className="px-4 py-4 text-white/40 text-xs font-inter whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-2">
                            {order.status === 'Pending' && (
                              <button
                                onClick={() => handleStatusChange(order._id, 'Confirmed', 'Order confirmed by admin')}
                                disabled={updatingId === order._id}
                                className="flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-400 rounded-xl px-3 py-1.5 text-xs font-outfit font-semibold transition-all disabled:opacity-50">
                                <FiCheck size={11} /> Confirm
                              </button>
                            )}
                            {order.status === 'Confirmed' && (
                              <button
                                onClick={() => handleStatusChange(order._id, 'Packed', 'Order packed and ready')}
                                disabled={updatingId === order._id}
                                className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-400 rounded-xl px-3 py-1.5 text-xs font-outfit font-semibold transition-all disabled:opacity-50">
                                <FiPackage size={11} /> Pack
                              </button>
                            )}
                            {order.status === 'Packed' && (
                              <button
                                onClick={() => handleStatusChange(order._id, 'Shipped', 'Order dispatched')}
                                disabled={updatingId === order._id}
                                className="flex items-center gap-1.5 bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-gold-400 rounded-xl px-3 py-1.5 text-xs font-outfit font-semibold transition-all disabled:opacity-50">
                                <FiTruck size={11} /> Ship
                              </button>
                            )}
                            {order.status === 'Shipped' && (
                              <button
                                onClick={() => handleStatusChange(order._id, 'Delivered', 'Order delivered successfully')}
                                disabled={updatingId === order._id}
                                className="flex items-center gap-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-400 rounded-xl px-3 py-1.5 text-xs font-outfit font-semibold transition-all disabled:opacity-50">
                                <FiHome size={11} /> Deliver
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Detail Row */}
                      <AnimatePresence>
                        {expandedId === order._id && (
                          <OrderDetailPanel
                            key={`detail-${order._id}`}
                            order={order}
                            onStatusChange={handleStatusChange}
                            updating={updatingId === order._id}
                          />
                        )}
                      </AnimatePresence>
                    </>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-white/10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-outfit font-semibold transition-all ${page === p ? 'bg-gold-500 text-green-950' : 'glass text-white/50 hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
