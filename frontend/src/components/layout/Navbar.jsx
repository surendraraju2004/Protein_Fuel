import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX,
  FiChevronDown, FiLogOut, FiSettings, FiPackage,
} from 'react-icons/fi'
import { logout } from '../../store/authSlice'
import { selectCartCount } from '../../store/cartSlice'
import { selectWishlist } from '../../store/wishlistSlice'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'Build Your Bar', path: '/build-your-bar' },
  { label: 'Nutrition', path: '/nutrition-calculator' },
  { label: 'Subscription', path: '/subscription' },
  { label: 'Blog', path: '/blog' },
  { label: 'About', path: '/about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const cartCount = useSelector(selectCartCount)
  const wishlist = useSelector(selectWishlist)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'
      }`}>
        <div className="section-padding py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center text-green-950 font-outfit font-black text-lg shadow-glow-gold">
              N
            </div>
            <span className="font-outfit font-bold text-xl text-white">
              Nutri<span className="text-gradient-gold">Bite</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* Wishlist */}
            <Link to="/dashboard?tab=wishlist" className="relative text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
              <FiHeart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-white/70 hover:text-gold-400 transition-colors p-2 rounded-lg hover:bg-white/5">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 rounded-full text-[10px] font-bold flex items-center justify-center text-green-950"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 glass rounded-full px-3 py-2 text-sm text-white/80 hover:text-white transition-all hover:bg-white/5"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-gold-500 flex items-center justify-center font-bold text-xs text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block max-w-[80px] truncate font-inter text-sm">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <FiChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-dark rounded-xl shadow-card-hover overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/10">
                        <p className="text-white font-medium text-sm font-outfit">{user?.name}</p>
                        <p className="text-white/50 text-xs truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                          <FiUser size={15} /> My Account
                        </Link>
                        <Link to="/dashboard?tab=orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                          <FiPackage size={15} /> My Orders
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gold-400 hover:text-gold-300 hover:bg-white/5 transition-colors">
                            <FiSettings size={15} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
                        >
                          <FiLogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-5 py-2.5 hidden sm:flex items-center gap-2">
                <FiUser size={15} /> Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-dark border-t border-white/10 overflow-hidden"
            >
              <div className="section-padding py-4 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`py-3 px-4 rounded-xl font-inter text-sm transition-all ${
                      location.pathname === link.path
                        ? 'bg-green-600/20 text-gold-400'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link to="/login" className="btn-primary text-center mt-2">Sign In</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-28 px-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              className="w-full max-w-2xl glass-dark rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="flex gap-3">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search protein bars, ingredients, categories..."
                  className="input-style flex-1"
                />
                <button type="submit" className="btn-primary px-6">
                  <FiSearch size={18} />
                </button>
              </form>
              <p className="text-white/40 text-sm mt-3">Try: "almond", "chocolate", "vegan", "keto"</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
