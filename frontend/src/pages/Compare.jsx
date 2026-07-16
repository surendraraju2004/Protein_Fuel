import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FiPlus, FiX, FiCheck } from 'react-icons/fi'
import api from '../api/axios'
import Loader from '../components/ui/Loader'
import { addToCart } from '../store/cartSlice'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const nutritionFields = [
  { key: 'calories', label: 'Calories', unit: 'kcal', color: 'text-gold-400' },
  { key: 'protein', label: 'Protein', unit: 'g', color: 'text-green-400' },
  { key: 'carbs', label: 'Carbs', unit: 'g', color: 'text-blue-400' },
  { key: 'fat', label: 'Fat', unit: 'g', color: 'text-orange-400' },
  { key: 'fiber', label: 'Fiber', unit: 'g', color: 'text-purple-400' },
  { key: 'sugar', label: 'Sugar', unit: 'g', color: 'text-red-400' },
]

export default function Compare() {
  const dispatch = useDispatch()
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    api.get('/products?limit=50').then(r => setAllProducts(r.data.products)).catch(() => {})
  }, [])

  const addProduct = (product) => {
    if (products.find(p => p._id === product._id)) { toast.error('Already in comparison'); return }
    if (products.length >= 4) { toast.error('Max 4 products can be compared'); return }
    setProducts(p => [...p, product])
    setShowPicker(false)
    setSearch('')
  }

  const removeProduct = (id) => setProducts(p => p.filter(x => x._id !== id))

  const filtered = allProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) && !products.find(x => x._id === p._id))

  const getBest = (field) => {
    if (products.length < 2) return null
    let best = null
    let bestVal = field === 'price' ? Infinity : -Infinity
    products.forEach(p => {
      const val = field === 'price' ? (p.discountPrice > 0 ? p.discountPrice : p.price) : (p.nutrition?.[field] || 0)
      if (field === 'price' ? val < bestVal : val > bestVal) { best = p._id; bestVal = val }
    })
    return best
  }

  return (
    <div className="pt-24 section-padding py-12">
      <div className="text-center mb-10">
        <span className="badge-gold mb-4 inline-block">Compare</span>
        <h1 className="section-title text-white mb-3">Compare <span className="text-gradient-gold">Products</span></h1>
        <p className="section-subtitle mx-auto text-center">Compare up to 4 products side-by-side to find your perfect bar.</p>
      </div>

      {/* Product Selection */}
      <div className="flex gap-4 mb-10 flex-wrap">
        {products.map(p => (
          <div key={p._id} className="flex items-center gap-3 glass rounded-2xl px-4 py-3 border border-green-600/30">
            <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-white font-inter text-sm font-medium max-w-[120px] truncate">{p.name}</span>
            <button onClick={() => removeProduct(p._id)} className="text-red-400 hover:text-red-300 transition-colors">
              <FiX size={14} />
            </button>
          </div>
        ))}

        {products.length < 4 && (
          <div className="relative">
            <button onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-2 glass rounded-2xl px-5 py-3 text-white/60 hover:text-white border border-dashed border-white/20 hover:border-white/40 transition-all font-inter text-sm">
              <FiPlus size={16} /> Add Product
            </button>

            {showPicker && (
              <div className="absolute top-full mt-2 left-0 w-72 glass-dark rounded-2xl p-4 z-50 shadow-card-hover">
                <input value={search} onChange={e => setSearch(e.target.value)} autoFocus
                  placeholder="Search products..." className="input-style text-sm mb-3" />
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                  {filtered.slice(0, 8).map(p => (
                    <button key={p._id} onClick={() => addProduct(p)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 text-left transition-colors">
                      <img src={p.images?.[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      <span className="text-white font-inter text-sm truncate">{p.name}</span>
                    </button>
                  ))}
                  {filtered.length === 0 && <p className="text-white/30 text-sm text-center py-4">No products found</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {products.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center">
          <div className="text-6xl mb-4">⚖️</div>
          <h3 className="font-outfit font-bold text-white text-xl mb-2">Add Products to Compare</h3>
          <p className="text-white/40 font-inter">Click "Add Product" above to start comparing bars side by side.</p>
        </div>
      ) : (
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-5 text-left text-white/40 text-xs font-outfit uppercase tracking-wider w-32">Attribute</th>
                  {products.map(p => (
                    <th key={p._id} className="p-5 text-center">
                      <img src={p.images?.[0]} alt={p.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3" />
                      <p className="font-outfit font-bold text-white text-sm line-clamp-2">{p.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price */}
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white/50 text-sm font-inter font-medium">Price</td>
                  {products.map(p => {
                    const price = p.discountPrice > 0 ? p.discountPrice : p.price
                    const isBest = getBest('price') === p._id
                    return (
                      <td key={p._id} className="p-4 text-center">
                        <span className={`font-outfit font-black text-lg ${isBest ? 'text-green-400' : 'text-white'}`}>₹{price}</span>
                        {isBest && <div className="text-green-400 text-xs font-inter mt-1 flex items-center justify-center gap-1"><FiCheck size={10} /> Best Price</div>}
                      </td>
                    )
                  })}
                </tr>

                {/* Rating */}
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white/50 text-sm font-inter font-medium">Rating</td>
                  {products.map(p => (
                    <td key={p._id} className="p-4 text-center font-outfit font-bold text-gold-400">{p.ratings.toFixed(1)} ⭐</td>
                  ))}
                </tr>

                {/* Weight */}
                <tr className="border-b border-white/5">
                  <td className="p-4 text-white/50 text-sm font-inter font-medium">Weight</td>
                  {products.map(p => (
                    <td key={p._id} className="p-4 text-center text-white font-inter text-sm">{p.weight || '—'}</td>
                  ))}
                </tr>

                {/* Nutrition */}
                {nutritionFields.map(field => (
                  <tr key={field.key} className="border-b border-white/5">
                    <td className="p-4 text-white/50 text-sm font-inter font-medium">{field.label}</td>
                    {products.map(p => {
                      const val = p.nutrition?.[field.key] || 0
                      const isBest = getBest(field.key) === p._id
                      return (
                        <td key={p._id} className="p-4 text-center">
                          <span className={`font-outfit font-bold text-base ${isBest ? field.color : 'text-white/70'}`}>{val}<span className="text-xs font-normal text-white/40">{field.unit}</span></span>
                          {isBest && <div className={`${field.color} text-xs flex items-center justify-center gap-1 mt-1`}><FiCheck size={10} /> Best</div>}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* Dietary */}
                {[
                  { key: 'isVegan', label: 'Vegan' },
                  { key: 'isGlutenFree', label: 'Gluten Free' },
                  { key: 'isKeto', label: 'Keto' },
                ].map(({ key, label }) => (
                  <tr key={key} className="border-b border-white/5">
                    <td className="p-4 text-white/50 text-sm font-inter font-medium">{label}</td>
                    {products.map(p => (
                      <td key={p._id} className="p-4 text-center">
                        {p[key] ? <span className="text-green-400 text-lg">✅</span> : <span className="text-white/20 text-lg">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* CTA */}
                <tr>
                  <td className="p-4" />
                  {products.map(p => (
                    <td key={p._id} className="p-4 text-center">
                      <button onClick={() => { dispatch(addToCart({ product: p, quantity: 1 })); toast.success('Added to cart!') }}
                        className="btn-primary text-sm px-4 py-2">Add to Cart</button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
