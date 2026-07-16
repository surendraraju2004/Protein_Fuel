import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiPhone } from 'react-icons/fi'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'
import toast from 'react-hot-toast'
import api from '../api/axios'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { name: form.name, email: form.email, phone: form.phone, password: form.password })
      dispatch(loginSuccess(data))
      toast.success(`Welcome to NutriBite, ${data.name.split(' ')[0]}! 🥜`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center section-padding py-20">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center text-green-950 font-outfit font-black text-xl shadow-glow-gold">N</div>
              <span className="font-outfit font-bold text-2xl text-white">Nutri<span className="text-gradient-gold">Bite</span></span>
            </Link>
            <p className="text-white/50 font-inter mt-2 text-sm">Create your account</p>
          </div>

          <div className="glass rounded-3xl p-8 border border-white/10">
            <h1 className="font-outfit font-bold text-2xl text-white mb-6">Join NutriBite</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { key: 'name', label: 'Full Name', icon: <FiUser />, type: 'text', placeholder: 'Your name' },
                { key: 'email', label: 'Email', icon: <FiMail />, type: 'email', placeholder: 'your@email.com' },
                { key: 'phone', label: 'Phone (optional)', icon: <FiPhone />, type: 'tel', placeholder: '10-digit mobile' },
              ].map(({ key, label, icon, type, placeholder }) => (
                <div key={key}>
                  <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-1.5">{label}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">{icon}</span>
                    <input type={type} value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                      placeholder={placeholder} className="input-style pl-10" required={key !== 'phone'} />
                  </div>
                </div>
              ))}

              {['password', 'confirmPassword'].map(key => (
                <div key={key}>
                  <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-1.5">
                    {key === 'password' ? 'Password' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <FiLock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type={showPass ? 'text' : 'password'} value={form[key]}
                      onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                      placeholder="Min 6 characters" className="input-style pl-10 pr-10" required />
                    {key === 'password' && (
                      <button type="button" onClick={() => setShowPass(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                        {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button type="submit" disabled={loading}
                className="btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
                {loading ? 'Creating Account...' : <><FiArrowRight size={16} /> Create Account</>}
              </button>
            </form>

            <p className="text-center text-white/50 font-inter text-sm mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors font-semibold">Sign in →</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
