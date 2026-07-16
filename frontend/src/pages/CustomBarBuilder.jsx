import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZap, FiArrowRight, FiArrowLeft, FiRefreshCw, FiShoppingCart, FiSave } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import toast from 'react-hot-toast'
import api from '../api/axios'

const steps = [
  {
    id: 'base', title: 'Choose Your Base', icon: '🌾', subtitle: 'The foundation of your bar',
    options: [
      { id: 'oats', label: 'Oats', emoji: '🌾', desc: 'High fiber, sustained energy' },
      { id: 'dates', label: 'Dates', emoji: '📅', desc: 'Natural sweetener, iron-rich' },
      { id: 'millets', label: 'Millets', emoji: '🌾', desc: 'Gluten-free, mineral-rich' },
      { id: 'quinoa', label: 'Quinoa', emoji: '🌿', desc: 'Complete protein source' },
    ],
    type: 'single',
  },
  {
    id: 'protein', title: 'Choose Your Protein', icon: '💪', subtitle: 'Boost your protein intake',
    options: [
      { id: 'whey', label: 'Whey Protein', emoji: '🥛', desc: 'Fast absorbing, 10g/serving' },
      { id: 'plant-protein', label: 'Plant Protein', emoji: '🌱', desc: 'Vegan-friendly, 9g/serving' },
      { id: 'soy', label: 'Soy Protein', emoji: '🫘', desc: 'Complete amino acids' },
      { id: 'peanut-protein', label: 'Peanut Protein', emoji: '🥜', desc: 'Rich & nutty flavour' },
    ],
    type: 'single',
  },
  {
    id: 'nuts', title: 'Add Your Nuts', icon: '🥜', subtitle: 'Healthy fats & crunch (multi-select)',
    options: [
      { id: 'almond', label: 'Almonds', emoji: '🫘', desc: 'Vitamin E, heart-healthy' },
      { id: 'cashew', label: 'Cashews', emoji: '🪙', desc: 'Creamy, magnesium-rich' },
      { id: 'walnut', label: 'Walnuts', emoji: '🧠', desc: 'Omega-3, brain food' },
      { id: 'pistachio', label: 'Pistachios', emoji: '🌰', desc: 'Protein-rich, antioxidants' },
    ],
    type: 'multi',
  },
  {
    id: 'seeds', title: 'Add Your Seeds', icon: '🌻', subtitle: 'Superfood power (multi-select)',
    options: [
      { id: 'pumpkin', label: 'Pumpkin Seeds', emoji: '🎃', desc: 'Zinc, magnesium' },
      { id: 'sunflower', label: 'Sunflower Seeds', emoji: '🌻', desc: 'Vitamin E, selenium' },
      { id: 'flax', label: 'Flax Seeds', emoji: '🌾', desc: 'Omega-3, lignans' },
      { id: 'chia', label: 'Chia Seeds', emoji: '⚫', desc: 'Fiber, calcium, protein' },
      { id: 'sesame', label: 'Sesame Seeds', emoji: '🟤', desc: 'Calcium, iron-rich' },
    ],
    type: 'multi',
  },
  {
    id: 'sweetener', title: 'Choose Sweetener', icon: '🍯', subtitle: 'Natural sweetness only',
    options: [
      { id: 'honey', label: 'Honey', emoji: '🍯', desc: 'Antimicrobial, natural' },
      { id: 'dates', label: 'Date Paste', emoji: '📅', desc: 'High fiber, iron' },
      { id: 'jaggery', label: 'Jaggery', emoji: '🟫', desc: 'Traditional, mineral-rich' },
      { id: 'stevia', label: 'Stevia', emoji: '🌿', desc: 'Zero-calorie, diabetic-friendly' },
    ],
    type: 'single',
  },
  {
    id: 'flavor', title: 'Choose Your Flavor', icon: '🍫', subtitle: 'The taste you love',
    options: [
      { id: 'chocolate', label: 'Chocolate', emoji: '🍫', desc: 'Dark & indulgent' },
      { id: 'coffee', label: 'Coffee', emoji: '☕', desc: 'Rich espresso notes' },
      { id: 'vanilla', label: 'Vanilla', emoji: '🤍', desc: 'Classic & creamy' },
      { id: 'mango', label: 'Mango', emoji: '🥭', desc: 'Tropical & fresh' },
      { id: 'strawberry', label: 'Strawberry', emoji: '🍓', desc: 'Sweet & tangy' },
      { id: 'blueberry', label: 'Blueberry', emoji: '🫐', desc: 'Antioxidant-rich' },
      { id: 'orange', label: 'Orange', emoji: '🍊', desc: 'Citrus burst' },
    ],
    type: 'single',
  },
  {
    id: 'toppings', title: 'Choose Toppings', icon: '✨', subtitle: 'The finishing touch (multi-select)',
    options: [
      { id: 'dark-chocolate', label: 'Dark Chocolate Drizzle', emoji: '🍫', desc: 'Rich cocoa coating' },
      { id: 'coconut', label: 'Coconut Flakes', emoji: '🥥', desc: 'Tropical crunch' },
      { id: 'dry-fruits', label: 'Dry Fruits Mix', emoji: '🍇', desc: 'Raisins, figs, apricots' },
      { id: 'granola', label: 'Granola Crunch', emoji: '🥣', desc: 'Extra crunch & texture' },
    ],
    type: 'multi',
  },
]

const INITIAL_SELECTIONS = { base: '', protein: '', nuts: [], seeds: [], sweetener: '', flavor: '', toppings: [] }

export default function CustomBarBuilder() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(s => s.auth)
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState(INITIAL_SELECTIONS)
  const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 })
  const [price, setPrice] = useState(60)
  const [barName, setBarName] = useState('My Custom Bar')
  const [calculating, setCalculating] = useState(false)
  const step = steps[currentStep]

  // Recalculate whenever selections change
  useEffect(() => {
    const isEmpty = !selections.base && !selections.protein && selections.nuts.length === 0 && selections.seeds.length === 0
    if (isEmpty) return
    setCalculating(true)
    api.post('/custom-bar/calculate', { selections })
      .then(r => { setNutrition(r.data.nutrition); setPrice(r.data.estimatedPrice) })
      .catch(() => {})
      .finally(() => setCalculating(false))
  }, [selections])

  const toggleOption = (stepId, optionId, type) => {
    setSelections(prev => {
      if (type === 'single') return { ...prev, [stepId]: prev[stepId] === optionId ? '' : optionId }
      const arr = prev[stepId]
      return { ...prev, [stepId]: arr.includes(optionId) ? arr.filter(x => x !== optionId) : [...arr, optionId] }
    })
  }

  const isSelected = (stepId, optionId, type) =>
    type === 'single' ? selections[stepId] === optionId : (selections[stepId] || []).includes(optionId)

  const canProceed = () => {
    const s = step
    if (s.type === 'single') return !!selections[s.id]
    return true // multi-select can be empty (optional)
  }

  const handleAddToCart = () => {
    const fakeProduct = {
      _id: 'custom-bar-' + Date.now(),
      name: barName,
      images: ['https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400'],
      price,
      discountPrice: 0,
      slug: 'custom-bar',
    }
    dispatch(addToCart({ product: fakeProduct, quantity: 1, flavor: selections.flavor }))
    toast.success('Custom bar added to cart! 🥜')
  }

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error('Please login to save your bar'); return }
    try {
      await api.post('/custom-bar/save', { selections, name: barName })
      toast.success('Bar saved to your profile!')
    } catch { toast.error('Failed to save') }
  }

  const resetBar = () => {
    setSelections(INITIAL_SELECTIONS)
    setCurrentStep(0)
    setNutrition({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 })
    setPrice(60)
  }

  const allStepsDone = currentStep === steps.length

  return (
    <div className="pt-24 section-padding py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="badge-gold mb-4 inline-block">Custom Builder</span>
        <h1 className="section-title text-white mb-3">
          Build Your <span className="text-gradient-gold">Perfect Bar</span>
        </h1>
        <p className="section-subtitle mx-auto text-center">
          7 steps to craft your dream protein bar. Watch calories & price update live!
        </p>
      </div>

      {/* Live Nutrition Panel */}
      <div className="glass rounded-3xl p-6 mb-8 border border-gold-500/20">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FiZap className="text-gold-400" size={18} />
            <h3 className="font-outfit font-bold text-white">Live Nutrition</h3>
            {calculating && <span className="text-white/40 text-xs font-inter animate-pulse">Calculating...</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-outfit font-black text-2xl text-gold-400">₹{price}</span>
            <button onClick={resetBar} className="flex items-center gap-1.5 glass rounded-xl px-3 py-1.5 text-white/60 hover:text-white text-xs font-inter transition-colors">
              <FiRefreshCw size={12} /> Reset
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { label: 'Calories', value: nutrition.calories, unit: 'kcal', color: 'text-gold-400' },
            { label: 'Protein', value: nutrition.protein, unit: 'g', color: 'text-green-400' },
            { label: 'Carbs', value: nutrition.carbs, unit: 'g', color: 'text-blue-400' },
            { label: 'Fat', value: nutrition.fat, unit: 'g', color: 'text-orange-400' },
            { label: 'Fiber', value: nutrition.fiber, unit: 'g', color: 'text-purple-400' },
            { label: 'Sugar', value: nutrition.sugar, unit: 'g', color: 'text-red-400' },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="bg-white/5 rounded-2xl p-3 text-center">
              <motion.div key={value} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`font-outfit font-bold text-xl ${color}`}>
                {value}<span className="text-xs font-normal">{unit}</span>
              </motion.div>
              <div className="text-white/40 text-xs font-inter">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => i <= currentStep && setCurrentStep(i)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-outfit font-bold transition-all duration-300
                ${i < currentStep ? 'bg-green-500 text-white cursor-pointer hover:bg-green-400' :
                  i === currentStep ? 'bg-gold-500 text-green-950 shadow-glow-gold scale-110' :
                  'bg-white/10 text-white/30 cursor-default'}`}
            >
              {i < currentStep ? '✓' : i + 1}
            </button>
            {i < steps.length - 1 && (
              <div className={`w-4 h-0.5 ${i < currentStep ? 'bg-green-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
        <button
          onClick={() => setCurrentStep(steps.length)}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-outfit font-bold transition-all duration-300
            ${allStepsDone ? 'bg-gold-500 text-green-950' : 'bg-white/10 text-white/30'}`}
        >
          🥜
        </button>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {!allStepsDone ? (
          <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <div className="glass rounded-3xl p-8 mb-6">
              <div className="text-center mb-8">
                <div className="text-5xl mb-3">{step.icon}</div>
                <h2 className="font-outfit font-bold text-white text-2xl sm:text-3xl">{step.title}</h2>
                <p className="text-white/50 font-inter text-sm mt-1">{step.subtitle}</p>
                {step.type === 'multi' && (
                  <span className="badge-green mt-2 inline-block">Select multiple</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {step.options.map(opt => {
                  const selected = isSelected(step.id, opt.id, step.type)
                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleOption(step.id, opt.id, step.type)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                        selected
                          ? 'border-gold-500 bg-gold-500/10 shadow-glow-gold'
                          : 'border-white/10 glass hover:border-white/30'
                      }`}
                    >
                      <div className="text-3xl mb-2">{opt.emoji}</div>
                      <p className={`font-outfit font-semibold text-sm mb-1 ${selected ? 'text-gold-400' : 'text-white'}`}>
                        {opt.label}
                      </p>
                      <p className="text-white/50 text-xs font-inter">{opt.desc}</p>
                      {selected && <div className="mt-2 w-4 h-4 bg-gold-500 rounded-full flex items-center justify-center text-green-950 text-[10px]">✓</div>}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-4">
              {currentStep > 0 && (
                <button onClick={() => setCurrentStep(s => s - 1)} className="btn-secondary flex items-center gap-2">
                  <FiArrowLeft size={16} /> Back
                </button>
              )}
              <button
                onClick={() => {
                  if (currentStep < steps.length - 1) setCurrentStep(s => s + 1)
                  else setCurrentStep(steps.length)
                }}
                disabled={!canProceed()}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentStep === steps.length - 1 ? 'See Your Bar 🥜' : 'Next Step'}
                <FiArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* ── RESULT ── */
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-3xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🥜</div>
              <h2 className="font-outfit font-black text-3xl text-white mb-2">Your Bar is Ready!</h2>
              <input
                value={barName}
                onChange={e => setBarName(e.target.value)}
                className="input-style text-center max-w-sm mx-auto text-lg font-outfit font-bold"
                placeholder="Name your bar..."
              />
            </div>

            {/* Recipe Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-white/60 text-xs font-outfit uppercase tracking-wider mb-4">Your Recipe</h3>
                {steps.map(s => {
                  const val = selections[s.id]
                  const display = Array.isArray(val) ? val.join(', ') : val
                  if (!display) return null
                  return (
                    <div key={s.id} className="flex justify-between items-start py-2 border-b border-white/5 text-sm">
                      <span className="text-white/50 font-inter capitalize">{s.id}</span>
                      <span className="text-white font-outfit font-medium capitalize text-right ml-4">{display.replace(/-/g, ' ')}</span>
                    </div>
                  )
                })}
              </div>
              <div>
                <h3 className="text-white/60 text-xs font-outfit uppercase tracking-wider mb-4">Nutrition Per Bar</h3>
                {[
                  { label: 'Calories', value: `${nutrition.calories} kcal`, color: 'text-gold-400' },
                  { label: 'Protein', value: `${nutrition.protein}g`, color: 'text-green-400' },
                  { label: 'Carbohydrates', value: `${nutrition.carbs}g`, color: 'text-blue-400' },
                  { label: 'Total Fat', value: `${nutrition.fat}g`, color: 'text-orange-400' },
                  { label: 'Dietary Fiber', value: `${nutrition.fiber}g`, color: 'text-purple-400' },
                  { label: 'Sugars', value: `${nutrition.sugar}g`, color: 'text-red-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-white/5 text-sm">
                    <span className="text-white/50 font-inter">{label}</span>
                    <span className={`font-outfit font-bold ${color}`}>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-3 text-base font-outfit font-bold">
                  <span className="text-white">Estimated Price</span>
                  <span className="text-gold-400 text-xl">₹{price}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2 py-4">
                <FiShoppingCart size={18} /> Add to Cart
              </button>
              <button onClick={handleSave} className="btn-secondary flex items-center gap-2 py-4 px-6">
                <FiSave size={16} /> Save Bar
              </button>
              <button onClick={resetBar} className="glass rounded-full px-6 py-4 text-white/60 hover:text-white font-outfit transition-colors flex items-center gap-2">
                <FiRefreshCw size={15} /> Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
