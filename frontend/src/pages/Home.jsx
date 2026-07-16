import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiArrowRight, FiPlay, FiChevronDown, FiStar, FiShield, FiZap, FiHeart, FiVolume2, FiVolumeX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeaturedProducts } from '../store/productSlice'
import ProductCard from '../components/products/ProductCard'
import Loader from '../components/ui/Loader'
import api from '../api/axios'

/* ── Ad Video Player with sound toggle ── */
function VideoPlayer() {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().then(() => setPlaying(true)).catch(() => {})
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setMuted(videoRef.current.muted)
    }
  }

  return (
    <div className="relative w-full" style={{ aspectRatio: '9/16', maxHeight: '80vh' }}>
      <video
        ref={videoRef}
        src="/ad-video.mp4"
        loop
        muted
        playsInline
        autoPlay
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
      {/* Sound toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-6 right-4 z-20 glass rounded-full p-3 border border-white/20 hover:border-gold-500/50 transition-all duration-200 hover:scale-110 active:scale-95"
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted
          ? <FiVolumeX size={20} className="text-white/70" />
          : <FiVolume2 size={20} className="text-gold-400" />
        }
      </button>
    </div>
  )
}

/* ── Trust badges ── */
const trustBadges = [
  { icon: '🌿', title: '100% Natural', sub: 'Zero artificial ingredients' },
  { icon: '💪', title: 'High Protein', sub: 'Up to 22g per bar' },
  { icon: '🚫', title: 'No Preservatives', sub: 'Fresh & handmade' },
  { icon: '🍯', title: 'No Added Sugar', sub: 'Sweetened with honey & dates' },
  { icon: '✋', title: 'Handmade', sub: 'Small-batch crafted' },
  { icon: '🇮🇳', title: 'Made in India', sub: 'Proudly homegrown' },
]

/* ── Categories ── */
const featuredCategories = [
  { name: 'Protein Bars', slug: 'protein-bars', emoji: '💪', color: 'from-green-900 to-green-700', count: '8+ variants' },
  { name: 'Energy Bars', slug: 'energy-bars', emoji: '⚡', color: 'from-yellow-900 to-yellow-700', count: '5+ variants' },
  { name: 'Keto Bars', slug: 'keto', emoji: '🥑', color: 'from-purple-900 to-purple-700', count: '4+ variants' },
  { name: 'Vegan', slug: 'vegan', emoji: '🌿', color: 'from-emerald-900 to-emerald-700', count: '6+ variants' },
  { name: 'Kids Bars', slug: 'kids-bars', emoji: '🌈', color: 'from-orange-900 to-orange-700', count: '3+ variants' },
  { name: 'Weight Loss', slug: 'weight-loss', emoji: '🏃', color: 'from-blue-900 to-blue-700', count: '4+ variants' },
  { name: 'Dry Fruit', slug: 'dry-fruit', emoji: '🥜', color: 'from-amber-900 to-amber-700', count: '5+ variants' },
  { name: 'Muscle Gain', slug: 'muscle-gain', emoji: '🏋️', color: 'from-red-900 to-red-700', count: '4+ variants' },
]

/* ── Testimonials ── */
const testimonials = [
  { name: 'Arjun S.', role: 'Gym Enthusiast', text: 'Best protein bars I\'ve ever had! The almond choco bar is my post-workout staple. 22g protein and zero guilt!', rating: 5, avatar: 'A' },
  { name: 'Priya P.', role: 'Yoga Practitioner', text: 'Finally found a healthy snack my whole family loves. The kids bar is amazing — my kids think it\'s a chocolate treat!', rating: 5, avatar: 'P' },
  { name: 'Rahul M.', role: 'Marathon Runner', text: 'I carry these on every run. The energy bar gives me sustained power without the sugar crash. Game changer!', rating: 5, avatar: 'R' },
  { name: 'Sneha K.', role: 'Working Professional', text: 'Perfect office snack. Keeps me full for 3+ hours and tastes incredible. Way better than store-bought protein bars.', rating: 5, avatar: 'S' },
  { name: 'Vikram J.', role: 'Fitness Trainer', text: 'I recommend NutriBite to all my clients. Clean ingredients, great macros, and they actually taste amazing!', rating: 5, avatar: 'V' },
]

/* ── Floating ingredients ── */
const floatingIngredients = [
  { emoji: '🥜', label: 'Peanuts', pos: 'top-20 left-[8%]', delay: 0 },
  { emoji: '🌾', label: 'Oats', pos: 'top-32 right-[10%]', delay: 1 },
  { emoji: '🍯', label: 'Honey', pos: 'bottom-40 left-[12%]', delay: 2 },
  { emoji: '🫒', label: 'Almonds', pos: 'bottom-32 right-[8%]', delay: 0.5 },
  { emoji: '🍫', label: 'Dark Choco', pos: 'top-1/2 left-[5%]', delay: 1.5 },
  { emoji: '🌻', label: 'Seeds', pos: 'top-1/2 right-[5%]', delay: 2.5 },
]

export default function Home() {
  const dispatch = useDispatch()
  const { featured, loading } = useSelector((s) => s.products)
  const [categories, setCategories] = useState([])
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroY = useTransform(scrollY, [0, 400], [0, 80])

  useEffect(() => {
    dispatch(fetchFeaturedProducts())
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [dispatch])

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* ══════════════ HERO ══════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(45,106,79,0.25) 0%, transparent 70%)',
        }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        {/* Floating Ingredients */}
        {floatingIngredients.map((item, i) => (
          <motion.div
            key={item.label}
            className={`absolute ${item.pos} hidden lg:flex flex-col items-center gap-1 z-10`}
            animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 5 + item.delay, repeat: Infinity, delay: item.delay, ease: 'easeInOut' }}
          >
            <div className="glass rounded-2xl p-3 text-3xl shadow-glow-green">{item.emoji}</div>
            <span className="text-white/40 text-xs font-inter">{item.label}</span>
          </motion.div>
        ))}

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-20 text-center section-padding max-w-5xl mx-auto pt-24 pb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8 border border-gold-500/30"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gold-400 text-sm font-outfit font-medium">Premium Homemade Protein Bars</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-outfit font-black text-5xl sm:text-6xl lg:text-8xl text-white leading-none mb-6"
          >
            Eat Clean.<br />
            <span className="text-gradient-gold">Stay Strong.</span><br />
            Live Better.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/65 text-lg sm:text-xl font-inter max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Handcrafted Homemade Protein Bars · Made with Natural Ingredients<br />
            <span className="text-green-400">No Preservatives · No Artificial Sugar · 100% Real Food</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/products" className="btn-primary text-base px-8 py-4 flex items-center gap-2 shadow-glow-gold">
              Shop Now <FiArrowRight size={18} />
            </Link>
            <Link to="/products" className="btn-secondary text-base px-8 py-4 flex items-center gap-2">
              Explore Products
            </Link>
            <Link to="/build-your-bar" className="btn-ghost flex items-center gap-2 text-base">
              <FiZap size={16} /> Build Your Bar
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-14"
          >
            {[
              { number: '10+', label: 'Flavors' },
              { number: '5K+', label: 'Happy Customers' },
              { number: '100%', label: 'Natural' },
              { number: '4.8★', label: 'Rating' },
            ].map(({ number, label }) => (
              <div key={label} className="text-center">
                <div className="font-outfit font-black text-2xl sm:text-3xl text-gradient-gold">{number}</div>
                <div className="text-white/50 text-sm font-inter">{label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 z-20"
        >
          <FiChevronDown size={28} />
        </motion.div>
      </section>

      {/* ══════════════ TRUST BADGES ══════════════ */}
      <section className="py-12 bg-green-950 border-y border-white/5">
        <div className="section-padding">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass rounded-2xl p-4 text-center group hover:border-green-600/40 hover:bg-green-600/5 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="font-outfit font-semibold text-white text-sm">{badge.title}</p>
                <p className="text-white/40 text-xs font-inter mt-0.5">{badge.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ VIDEO SHOWCASE ══════════════ */}
      <section className="py-20 section-padding overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="badge-gold mb-4 inline-block">Our Story</span>
            <h2 className="section-title text-white mb-4">
              See It In <span className="text-gradient-gold">Action</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Watch how we craft every bar with love, care, and the finest natural ingredients.
            </p>
          </motion.div>

          {/* Video container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative rounded-3xl overflow-hidden"
            style={{
              boxShadow: '0 0 0 1px rgba(45,106,79,0.4), 0 0 60px rgba(45,106,79,0.2), 0 30px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Glow border effect */}
            <div className="absolute inset-0 rounded-3xl z-10 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(212,160,23,0.15)' }}
            />

            {/* Video */}
            <VideoPlayer />

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(15,35,24,0.8), transparent)' }}
            />

            {/* Brand badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 glass rounded-full px-4 py-2 border border-gold-500/30">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gold-400 text-xs font-outfit font-semibold tracking-wide">NutriBite · Official Ad</span>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <Link to="/products" className="btn-primary flex items-center gap-2">
              Shop Now <FiArrowRight size={16} />
            </Link>
            <Link to="/about" className="btn-secondary flex items-center gap-2">
              Our Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FEATURED CATEGORIES ══════════════ */}
      <section className="py-20 section-padding">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <span className="badge-gold mb-4 inline-block">Categories</span>
            <h2 className="section-title text-white mb-4">
              Find Your Perfect <span className="text-gradient-gold">Bar</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              Whether you're hitting the gym, managing weight, or just snacking smart — we've got a bar for that.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredCategories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className={`category-card bg-gradient-to-br ${cat.color} p-6 flex flex-col items-center gap-3 border border-white/10 hover:border-white/25 hover:shadow-card-hover`}
              >
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{cat.emoji}</div>
                <div className="text-center">
                  <p className="font-outfit font-bold text-white text-sm">{cat.name}</p>
                  <p className="text-white/50 text-xs font-inter">{cat.count}</p>
                </div>
                <div className="flex items-center gap-1 text-white/60 text-xs font-inter group-hover:text-gold-400 transition-colors">
                  Shop Now <FiArrowRight size={12} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════ FEATURED PRODUCTS ══════════════ */}
      <section className="py-20 section-padding bg-green-950/50">
        <div className="text-center mb-12">
          <span className="badge-gold mb-4 inline-block">Our Best</span>
          <h2 className="section-title text-white mb-4">
            Featured <span className="text-gradient-gold">Products</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Our most-loved, best-selling protein bars crafted for every lifestyle.
          </p>
        </div>

        {loading ? (
          <Loader text="Loading products..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(featured.length > 0 ? featured : []).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
            View All Products <FiArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ══════════════ CUSTOM BAR BUILDER CTA ══════════════ */}
      <section className="py-20 section-padding">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-gold-900 p-12 text-center border border-white/10"
          style={{ background: 'linear-gradient(135deg, #1a3c2e 0%, #2d6a4f 50%, #3d2b0a 100%)' }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="text-5xl mb-4">🧪</div>
            <h2 className="font-outfit font-black text-4xl sm:text-5xl text-white mb-4">
              Build <span className="text-gradient-gold">Your Perfect Bar</span>
            </h2>
            <p className="text-white/65 text-lg font-inter max-w-xl mx-auto mb-8">
              Choose your base, protein, nuts, seeds, sweetener, and flavor.
              Watch calories and protein calculate live as you design your dream bar!
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Choose Base', 'Pick Protein', 'Add Nuts', 'Add Seeds', 'Select Flavor', 'Choose Toppings'].map((step, i) => (
                <span key={step} className="glass rounded-full px-4 py-2 text-sm text-white/80 font-outfit">
                  <span className="text-gold-400 font-bold">{i + 1}.</span> {step}
                </span>
              ))}
            </div>
            <Link to="/build-your-bar" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
              <FiZap size={18} /> Start Building Now
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════════ NUTRITION CALCULATOR CTA ══════════════ */}
      <section className="py-16 section-padding bg-green-950/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="badge-green mb-4 inline-block">Smart Nutrition</span>
            <h2 className="section-title text-white mb-4">
              Know Exactly <span className="text-gradient-gold">What Your Body Needs</span>
            </h2>
            <p className="text-white/60 font-inter text-base leading-relaxed mb-6">
              Enter your age, weight, height, and fitness goal — our calculator will recommend
              your daily protein intake, ideal calorie target, and the perfect NutriBite bars for you.
            </p>
            <ul className="flex flex-col gap-3 mb-8">
              {['BMI & TDEE calculation', 'Goal-based protein recommendation', 'Personalized product suggestions'].map(item => (
                <li key={item} className="flex items-center gap-3 text-white/70 font-inter text-sm">
                  <span className="w-5 h-5 bg-green-600/30 rounded-full flex items-center justify-center text-green-400 text-xs flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/nutrition-calculator" className="btn-primary inline-flex items-center gap-2">
              Try Calculator <FiArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Daily Protein', value: '156g', icon: '💪', color: 'text-green-400' },
                { label: 'Target Calories', value: '2,100', icon: '🔥', color: 'text-gold-400' },
                { label: 'Bars/Day', value: '2-3', icon: '🥜', color: 'text-blue-400' },
                { label: 'BMI Status', value: 'Healthy', icon: '✅', color: 'text-green-400' },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className={`font-outfit font-bold text-xl ${color}`}>{value}</div>
                  <div className="text-white/50 text-xs font-inter mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <p className="text-white/30 text-xs font-inter text-center mt-4">Sample output — enter your details to get personalized results</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="py-20 section-padding">
        <div className="text-center mb-12">
          <span className="badge-gold mb-4 inline-block">Testimonials</span>
          <h2 className="section-title text-white mb-4">
            Loved by <span className="text-gradient-gold">10,000+</span> Customers
          </h2>
        </div>

        {/* Featured testimonial */}
        <div className="max-w-3xl mx-auto mb-8">
          <motion.div
            key={testimonialIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-8 text-center border border-white/10"
          >
            <div className="flex justify-center mb-4">
              {[1,2,3,4,5].map(s => (
                <FiStar key={s} size={20} className="text-gold-400 fill-current" fill="currentColor" />
              ))}
            </div>
            <p className="text-white/80 text-lg font-inter leading-relaxed italic mb-6">
              "{testimonials[testimonialIdx].text}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-gold-500 flex items-center justify-center font-outfit font-bold text-white">
                {testimonials[testimonialIdx].avatar}
              </div>
              <div className="text-left">
                <p className="text-white font-outfit font-semibold text-sm">{testimonials[testimonialIdx].name}</p>
                <p className="text-white/50 text-xs font-inter">{testimonials[testimonialIdx].role}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setTestimonialIdx(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === testimonialIdx ? 'bg-gold-500 w-6' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </section>

      {/* ══════════════ SUBSCRIPTION CTA ══════════════ */}
      <section className="py-16 section-padding bg-green-950">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 text-center border border-gold-500/20 max-w-3xl mx-auto"
        >
          <div className="text-5xl mb-4">📦</div>
          <h2 className="font-outfit font-bold text-3xl text-white mb-3">
            Subscribe & <span className="text-gradient-gold">Save 15%</span>
          </h2>
          <p className="text-white/60 font-inter mb-6">
            Get your favourite bars delivered weekly, biweekly, or monthly.
            Cancel anytime. Free shipping on all subscription orders.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['Weekly — 15% off', 'Biweekly — 10% off', 'Monthly — 8% off'].map(p => (
              <span key={p} className="glass rounded-full px-5 py-2 text-sm text-white/80 font-outfit border border-white/10">{p}</span>
            ))}
          </div>
          <Link to="/subscription" className="btn-primary inline-flex items-center gap-2">
            View Subscription Plans <FiArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
