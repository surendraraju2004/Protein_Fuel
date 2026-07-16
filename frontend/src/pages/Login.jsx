import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'
import toast from 'react-hot-toast'
import api from '../api/axios'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      dispatch(loginSuccess(data))
      toast.success(`Welcome back, ${data.name.split(' ')[0]}! 🎉`)
      navigate(data.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center section-padding py-20">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center text-green-950 font-outfit font-black text-xl shadow-glow-gold">N</div>
              <span className="font-outfit font-bold text-2xl text-white">Nutri<span className="text-gradient-gold">Bite</span></span>
            </Link>
            <p className="text-white/50 font-inter mt-2 text-sm">Sign in to your account</p>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/10">
            <h1 className="font-outfit font-bold text-2xl text-white mb-6">Welcome Back</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-1.5">Email</label>
                <div className="relative">
                  <FiMail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    placeholder="your@email.com" className="input-style pl-10" required />
                </div>
              </div>

              <div>
                <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-1.5">Password</label>
                <div className="relative">
                  <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm(f => ({...f, password: e.target.value}))}
                    placeholder="Your password" className="input-style pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                {loading ? 'Signing in...' : <><FiArrowRight size={16} /> Sign In</>}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-4 glass rounded-xl p-3 border border-gold-500/20">
              <p className="text-white/40 text-xs font-outfit mb-1">Demo Credentials:</p>
              <p className="text-gold-400 text-xs font-inter">Admin: admin@nutribite.in / Admin@123</p>
              <p className="text-white/60 text-xs font-inter">User: arjun@example.com / User@123</p>
            </div>

            <p className="text-center text-white/50 font-inter text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold-400 hover:text-gold-300 transition-colors font-semibold">Create one →</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
