import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiPackage, FiDollarSign, FiShoppingCart, FiBox, FiTrendingUp, FiPlus, FiAlertCircle } from 'react-icons/fi'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../../api/axios'
import Loader from '../../components/ui/Loader'

const adminLinks = [
  { label: 'Dashboard', path: '/admin', icon: <FiTrendingUp /> },
  { label: 'Products', path: '/admin/products', icon: <FiBox /> },
  { label: 'Orders', path: '/admin/orders', icon: <FiPackage /> },
  { label: 'Customers', path: '/admin/customers', icon: <FiUsers /> },
]

const COLORS = ['#2d6a4f', '#d4a017', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="pt-28 section-padding"><Loader text="Loading dashboard..." /></div>

  const monthlyData = stats?.monthlyRevenue?.map(m => ({
    name: new Date(2024, m._id.month - 1).toLocaleString('en', { month: 'short' }),
    revenue: m.revenue,
    orders: m.orders,
  })) || []

  const pieData = stats?.ordersByStatus?.map(s => ({ name: s._id, value: s.count })) || []

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: <FiDollarSign />, color: 'text-gold-400', bg: 'bg-gold-500/10 border-gold-500/20' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FiShoppingCart />, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: <FiBox />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { label: 'Total Customers', value: stats?.totalUsers || 0, icon: <FiUsers />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  ]

  const pendingCount = stats?.ordersByStatus?.find(s => s._id === 'Pending')?.count || 0

  return (
    <div className="pt-24 section-padding py-12">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="section-title text-white">Admin <span className="text-gradient-gold">Dashboard</span></h1>
          <p className="text-white/50 font-inter text-sm">NutriBite · Store Analytics</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {adminLinks.map(l => (
            <Link key={l.path} to={l.path} className="flex items-center gap-2 glass rounded-xl px-4 py-2 text-white/70 hover:text-white text-sm font-inter transition-all hover:bg-white/5 relative">
              {l.icon} {l.label}
              {l.label === 'Orders' && pendingCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-500 text-green-950 text-[9px] font-bold rounded-full flex items-center justify-center">{pendingCount}</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Pending Orders Alert */}
      {pendingCount > 0 && (
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-5 py-3 mb-6">
          <FiAlertCircle className="text-yellow-400 flex-shrink-0" size={18}/>
          <p className="text-yellow-300 font-inter text-sm">
            You have <span className="font-bold">{pendingCount} pending order{pendingCount > 1 ? 's' : ''}</span> waiting for confirmation.
          </p>
          <Link to="/admin/orders" className="ml-auto text-xs font-outfit font-semibold text-yellow-400 hover:text-yellow-300 whitespace-nowrap">Review Now →</Link>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Add Product', to: '/admin/products', icon: <FiPlus />, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
          { label: 'View Orders', to: '/admin/orders', icon: <FiPackage />, color: 'text-gold-400 bg-gold-500/10 border-gold-500/20' },
          { label: 'Customers', to: '/admin/customers', icon: <FiUsers />, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
          { label: 'Store Front', to: '/', icon: <FiTrendingUp />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
        ].map(q => (
          <Link key={q.label} to={q.to}
            className={`glass rounded-xl p-4 border flex items-center gap-3 hover:scale-105 transition-all duration-200 ${q.color}`}>
            <span className="text-lg">{q.icon}</span>
            <span className="font-outfit font-semibold text-sm">{q.label}</span>
          </Link>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass rounded-2xl p-6 border ${bg}`}
          >
            <div className={`w-10 h-10 rounded-xl ${bg} border flex items-center justify-center ${color} mb-4`}>
              {icon}
            </div>
            <div className={`font-outfit font-black text-2xl ${color} mb-1`}>{value}</div>
            <div className="text-white/50 font-inter text-sm">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h3 className="font-outfit font-bold text-white mb-6">Monthly Revenue</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#2d6a4f" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/30 font-inter text-sm">
              No revenue data yet. Place some orders!
            </div>
          )}
        </div>

        {/* Order Status Pie */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-outfit font-bold text-white mb-6">Orders by Status</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 mt-2">
                {pieData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs font-inter">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-white/60">{entry.name}</span>
                    </div>
                    <span className="text-white font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-white/30 text-sm">No order data</div>
          )}
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-outfit font-bold text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-gold-400 hover:text-gold-300 text-sm font-inter">View all →</Link>
          </div>
          {stats?.recentOrders?.length === 0 && (
            <p className="text-white/30 text-sm font-inter text-center py-8">No orders yet</p>
          )}
          {stats?.recentOrders?.map(order => (
            <div key={order._id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <div>
                <p className="text-white font-outfit font-semibold text-sm">{order.orderId}</p>
                <p className="text-white/40 text-xs font-inter">{order.user?.name} • {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-outfit font-bold text-sm">₹{order.totalPrice}</p>
                <span className={`text-xs font-outfit ${order.status === 'Delivered' ? 'text-green-400' : order.status === 'Cancelled' ? 'text-red-400' : 'text-gold-400'}`}>{order.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Top Products */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-outfit font-bold text-white mb-5">Top Selling Products</h3>
          {stats?.topProducts?.length === 0 && (
            <p className="text-white/30 text-sm font-inter text-center py-8">No sales data yet</p>
          )}
          {stats?.topProducts?.map((p, i) => (
            <div key={p._id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
              <div className="w-8 h-8 rounded-lg glass flex items-center justify-center font-outfit font-bold text-white/60 text-sm flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-inter text-sm truncate">{p.name}</p>
                <p className="text-white/40 text-xs font-inter">{p.totalSold} sold</p>
              </div>
              <p className="text-gold-400 font-outfit font-bold text-sm">₹{p.revenue?.toFixed(0)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
