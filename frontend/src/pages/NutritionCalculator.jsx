import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiActivity, FiUser, FiZap, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const activityOptions = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', icon: '🛋️' },
  { id: 'light', label: 'Light', desc: '1-3 days/week', icon: '🚶' },
  { id: 'moderate', label: 'Moderate', desc: '3-5 days/week', icon: '🏃' },
  { id: 'active', label: 'Active', desc: '6-7 days/week', icon: '💪' },
  { id: 'very_active', label: 'Very Active', desc: 'Athlete-level', icon: '🏋️' },
]

const goalOptions = [
  { id: 'lose-fat', label: 'Lose Fat', icon: '🏃', color: 'from-blue-900 to-blue-700' },
  { id: 'gain-muscle', label: 'Gain Muscle', icon: '💪', color: 'from-red-900 to-red-700' },
  { id: 'maintain-weight', label: 'Maintain Weight', icon: '⚖️', color: 'from-green-900 to-green-700' },
]

export default function NutritionCalculator() {
  const [form, setForm] = useState({ age: '', gender: 'male', heightCm: '', weightKg: '', activityLevel: 'moderate', goal: 'maintain-weight' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/nutrition/calculate', form)
      setResult(data)
      toast.success('Nutrition calculated! 🎯')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Calculation failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="pt-24 section-padding py-12 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="badge-green mb-4 inline-block">Smart Nutrition</span>
        <h1 className="section-title text-white mb-3">
          Your Personal <span className="text-gradient-gold">Nutrition Plan</span>
        </h1>
        <p className="section-subtitle mx-auto text-center">
          Enter your details below. We'll calculate your daily protein intake, calorie target, and ideal NutriBite bars.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="glass rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Gender */}
            <div>
              <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-3">Gender</label>
              <div className="flex gap-3">
                {[{ id: 'male', label: 'Male', icon: '👨' }, { id: 'female', label: 'Female', icon: '👩' }].map(g => (
                  <button key={g.id} type="button" onClick={() => setForm(f => ({ ...f, gender: g.id }))}
                    className={`flex-1 py-3 rounded-xl border-2 text-sm font-outfit font-semibold transition-all flex items-center justify-center gap-2
                      ${form.gender === g.id ? 'border-gold-500 bg-gold-500/10 text-gold-400' : 'border-white/10 glass text-white/60 hover:border-white/30'}`}>
                    <span>{g.icon}</span> {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age, Height, Weight */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'age', label: 'Age', placeholder: '25', unit: 'yrs' },
                { key: 'heightCm', label: 'Height', placeholder: '170', unit: 'cm' },
                { key: 'weightKg', label: 'Weight', placeholder: '70', unit: 'kg' },
              ].map(({ key, label, placeholder, unit }) => (
                <div key={key}>
                  <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-1.5">{label}</label>
                  <div className="relative">
                    <input type="number" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder} className="input-style pr-8 text-sm" required min={1} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Activity Level */}
            <div>
              <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-3">Activity Level</label>
              <div className="flex flex-col gap-2">
                {activityOptions.map(opt => (
                  <button key={opt.id} type="button" onClick={() => setForm(f => ({ ...f, activityLevel: opt.id }))}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all
                      ${form.activityLevel === opt.id ? 'border-green-500 bg-green-600/10' : 'border-white/10 glass hover:border-white/30'}`}>
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <p className={`font-outfit font-semibold text-sm ${form.activityLevel === opt.id ? 'text-green-400' : 'text-white'}`}>{opt.label}</p>
                      <p className="text-white/40 text-xs font-inter">{opt.desc}</p>
                    </div>
                    {form.activityLevel === opt.id && <div className="ml-auto w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-3">Your Goal</label>
              <div className="grid grid-cols-3 gap-3">
                {goalOptions.map(g => (
                  <button key={g.id} type="button" onClick={() => setForm(f => ({ ...f, goal: g.id }))}
                    className={`py-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all bg-gradient-to-br ${g.color}
                      ${form.goal === g.id ? 'border-gold-500 shadow-glow-gold scale-105' : 'border-white/10 hover:border-white/30'}`}>
                    <span className="text-2xl">{g.icon}</span>
                    <span className={`font-outfit font-semibold text-xs ${form.goal === g.id ? 'text-gold-400' : 'text-white/70'}`}>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Calculating...' : <><FiActivity size={16} /> Calculate My Plan</>}
            </button>
          </form>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result ? (
            <motion.div key="result" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
              {/* BMI */}
              <div className="glass rounded-2xl p-6 border border-green-600/30">
                <h3 className="font-outfit font-bold text-white mb-4 flex items-center gap-2"><FiUser className="text-green-400" /> BMI Analysis</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-outfit font-black text-4xl text-white">{result.bmi.value}</div>
                    <div className={`font-outfit font-semibold text-lg mt-1 ${
                      result.bmi.category === 'Normal weight' ? 'text-green-400' :
                      result.bmi.category === 'Underweight' ? 'text-blue-400' : 'text-orange-400'
                    }`}>{result.bmi.category}</div>
                  </div>
                  <div className="text-5xl">
                    {result.bmi.category === 'Normal weight' ? '✅' :
                     result.bmi.category === 'Underweight' ? '📉' :
                     result.bmi.category === 'Overweight' ? '⚠️' : '🔴'}
                  </div>
                </div>
              </div>

              {/* Calories */}
              <div className="glass rounded-2xl p-6 border border-gold-500/20">
                <h3 className="font-outfit font-bold text-white mb-4 flex items-center gap-2"><FiZap className="text-gold-400" /> Daily Calories</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'BMR', value: result.calories.bmr, desc: 'Base rate' },
                    { label: 'TDEE', value: result.calories.tdee, desc: 'With activity' },
                    { label: 'Target', value: result.calories.target, desc: result.goal.replace('-', ' '), highlight: true },
                  ].map(({ label, value, desc, highlight }) => (
                    <div key={label} className={`rounded-xl p-3 ${highlight ? 'bg-gold-500/20 border border-gold-500/30' : 'bg-white/5'}`}>
                      <div className={`font-outfit font-black text-xl ${highlight ? 'text-gold-400' : 'text-white'}`}>{value}</div>
                      <div className="text-white font-outfit text-xs font-semibold">{label}</div>
                      <div className="text-white/40 text-[10px] font-inter capitalize">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protein */}
              <div className="glass rounded-2xl p-6 border border-green-600/30">
                <h3 className="font-outfit font-bold text-white mb-4">💪 Daily Protein Goal</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-outfit font-black text-4xl text-green-400">{result.protein.grams}<span className="text-xl font-normal">g</span></div>
                    <div className="text-white/50 font-inter text-sm">per day</div>
                  </div>
                  <div className="text-center">
                    <div className="font-outfit font-black text-3xl text-gold-400">{result.protein.barsPerDay}</div>
                    <div className="text-white/50 font-inter text-sm">NutriBite bars/day</div>
                  </div>
                </div>
                <div className="glass rounded-xl p-3 flex items-center gap-3">
                  <span className="text-2xl">🥜</span>
                  <p className="text-white/70 font-inter text-sm">
                    Have <strong className="text-gold-400">{result.protein.barsPerDay} bars</strong> daily to meet your protein goal.
                  </p>
                </div>
              </div>

              <Link to="/products" className="btn-primary flex items-center justify-center gap-2 py-4">
                Shop Recommended Bars <FiArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-dashed border-white/10">
              <div className="text-6xl mb-4">🧮</div>
              <h3 className="font-outfit font-bold text-white text-xl mb-2">Your Results Appear Here</h3>
              <p className="text-white/40 font-inter text-sm">Fill in the form and click Calculate to see your personalised nutrition plan.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
