import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center section-padding">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-8xl mb-6">🥜</div>
        <h1 className="font-outfit font-black text-6xl text-white mb-4">404</h1>
        <p className="font-outfit font-bold text-2xl text-white/60 mb-2">Page Not Found</p>
        <p className="text-white/40 font-inter mb-8">Looks like this page went to the gym and never came back.</p>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </motion.div>
    </div>
  )
}
