import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX, FiInstagram, FiImage, FiTag, FiPackage } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import Loader from '../../components/ui/Loader'

const EMPTY_FORM = {
  name: '', slug: '', description: '', shortDescription: '', category: '',
  price: '', discountPrice: '', stock: '', weight: '60g',
  images: '', instagramUrl: '',
  ingredients: '', benefits: '', flavors: '',
  protein: '', calories: '', carbs: '', fat: '', fiber: '',
  isFeatured: false, isBestSeller: false,
  isVegan: false, isKeto: false, isGlutenFree: false,
  shelfLife: '3 months',
}

const Toggle = ({ checked, onChange, label, color = 'bg-green-500' }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <div className={`w-10 h-5 rounded-full transition-colors ${checked ? color : 'bg-white/15'} flex items-center px-0.5`}>
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </div>
    <span className="text-white/70 text-sm font-inter">{label}</span>
  </label>
)

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Auto-generate slug from name
  useEffect(() => {
    if (!editProduct) {
      set('slug', form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }, [form.name])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams({ page, limit: 15, search }).toString()
      const { data } = await api.get(`/products?${q}`)
      setProducts(data.products)
      setTotalPages(data.pages)
    } catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [page, search])
  useEffect(() => { api.get('/categories').then(r => setCategories(r.data)).catch(() => {}) }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch { toast.error('Delete failed') }
  }

  const csvToArray = (str) => str ? str.split(',').map(s => s.trim()).filter(Boolean) : []

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name, slug: form.slug,
        description: form.description, shortDescription: form.shortDescription,
        category: form.category,
        price: Number(form.price), discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock), weight: form.weight,
        images: csvToArray(form.images),
        ingredients: csvToArray(form.ingredients),
        benefits: csvToArray(form.benefits),
        flavors: csvToArray(form.flavors),
        nutrition: {
          protein: Number(form.protein) || 0,
          calories: Number(form.calories) || 0,
          carbs: Number(form.carbs) || 0,
          fat: Number(form.fat) || 0,
          fiber: Number(form.fiber) || 0,
        },
        isFeatured: form.isFeatured, isBestSeller: form.isBestSeller,
        isVegan: form.isVegan, isKeto: form.isKeto, isGlutenFree: form.isGlutenFree,
        shelfLife: form.shelfLife,
      }

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload)
        toast.success('✅ Product updated!')
      } else {
        await api.post('/products', payload)
        toast.success('✅ Product created!')
      }
      setShowForm(false)
      setEditProduct(null)
      setForm(EMPTY_FORM)
      fetchProducts()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setForm({
      name: p.name, slug: p.slug,
      description: p.description || '', shortDescription: p.shortDescription || '',
      category: p.category?._id || '',
      price: p.price, discountPrice: p.discountPrice || '',
      stock: p.stock, weight: p.weight || '60g',
      images: (p.images || []).join(', '),
      instagramUrl: '',
      ingredients: (p.ingredients || []).join(', '),
      benefits: (p.benefits || []).join(', '),
      flavors: (p.flavors || []).join(', '),
      protein: p.nutrition?.protein || '',
      calories: p.nutrition?.calories || '',
      carbs: p.nutrition?.carbs || '',
      fat: p.nutrition?.fat || '',
      fiber: p.nutrition?.fiber || '',
      isFeatured: p.isFeatured, isBestSeller: p.isBestSeller,
      isVegan: p.isVegan, isKeto: p.isKeto, isGlutenFree: p.isGlutenFree,
      shelfLife: p.shelfLife || '3 months',
    })
    setActiveTab('basic')
    setShowForm(true)
  }

  const openNew = () => {
    setEditProduct(null)
    setForm(EMPTY_FORM)
    setActiveTab('basic')
    setShowForm(true)
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <FiPackage size={13} /> },
    { id: 'media', label: 'Images & Instagram', icon: <FiImage size={13} /> },
    { id: 'nutrition', label: 'Nutrition', icon: <FiTag size={13} /> },
    { id: 'details', label: 'Details & Tags', icon: <FiCheck size={13} /> },
  ]

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-green-500 transition-all"
  const labelCls = "text-white/50 text-xs font-outfit uppercase tracking-wider block mb-1.5"

  return (
    <div className="pt-24 section-padding py-12 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-outfit font-bold text-3xl text-white">Products <span className="text-gradient-gold">Management</span></h1>
          <p className="text-white/40 text-sm font-inter mt-1">Add, edit and manage your protein bar catalog</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin" className="btn-secondary text-sm px-4 py-2">← Dashboard</Link>
          <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
            <FiPlus size={15} /> Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search products..." className="input-style pl-10" />
      </div>

      {/* ── Product Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="glass-dark rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col"
              style={{ border: '1px solid rgba(45,106,79,0.3)' }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div>
                  <h2 className="font-outfit font-bold text-white text-xl">
                    {editProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                  </h2>
                  <p className="text-white/40 text-xs font-inter mt-0.5">
                    {editProduct ? `Editing: ${editProduct.name}` : 'Fill in the details below'}
                  </p>
                </div>
                <button onClick={() => { setShowForm(false); setEditProduct(null) }}
                  className="w-9 h-9 glass rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors">
                  <FiX size={18} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 px-6 pt-4 pb-2 overflow-x-auto">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-outfit font-semibold transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-green-600/30 text-green-400 border border-green-500/40' : 'text-white/40 hover:text-white/70'}`}>
                    {t.icon}{t.label}
                  </button>
                ))}
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-4">

                {/* ── Tab: Basic Info ── */}
                {activeTab === 'basic' && (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Product Name *</label>
                        <input value={form.name} onChange={e => set('name', e.target.value)}
                          className={inputCls} placeholder="e.g. Almond Choco Bar" required />
                      </div>
                      <div>
                        <label className={labelCls}>URL Slug *</label>
                        <input value={form.slug} onChange={e => set('slug', e.target.value)}
                          className={inputCls} placeholder="almond-choco-bar" required />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Category *</label>
                      <select value={form.category} onChange={e => set('category', e.target.value)}
                        className={inputCls} required>
                        <option value="">Select category...</option>
                        {categories.map(c => <option key={c._id} value={c._id} className="bg-green-950">{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Short Description</label>
                      <input value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)}
                        className={inputCls} placeholder="One-line summary shown on cards" />
                    </div>
                    <div>
                      <label className={labelCls}>Full Description *</label>
                      <textarea value={form.description} onChange={e => set('description', e.target.value)}
                        className={inputCls + ' resize-none'} rows={4} placeholder="Detailed product description..." required />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className={labelCls}>Price (₹) *</label>
                        <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                          className={inputCls} placeholder="299" required />
                      </div>
                      <div>
                        <label className={labelCls}>Sale Price (₹)</label>
                        <input type="number" value={form.discountPrice} onChange={e => set('discountPrice', e.target.value)}
                          className={inputCls} placeholder="249" />
                      </div>
                      <div>
                        <label className={labelCls}>Stock *</label>
                        <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)}
                          className={inputCls} placeholder="50" required />
                      </div>
                      <div>
                        <label className={labelCls}>Weight</label>
                        <input value={form.weight} onChange={e => set('weight', e.target.value)}
                          className={inputCls} placeholder="60g" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Flavors (comma-separated)</label>
                      <input value={form.flavors} onChange={e => set('flavors', e.target.value)}
                        className={inputCls} placeholder="Chocolate, Vanilla, Strawberry" />
                    </div>
                  </div>
                )}

                {/* ── Tab: Media & Instagram ── */}
                {activeTab === 'media' && (
                  <div className="flex flex-col gap-4">
                    <div className="glass rounded-2xl p-4 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <FiInstagram className="text-pink-400" size={16} />
                        <p className="text-white font-outfit font-semibold text-sm">Add from Instagram</p>
                      </div>
                      <p className="text-white/50 text-xs font-inter mb-3">
                        Paste your Instagram reel/post URL for reference. Add the image URL from that post below.
                      </p>
                      <input value={form.instagramUrl} onChange={e => set('instagramUrl', e.target.value)}
                        className={inputCls} placeholder="https://www.instagram.com/reel/..." />
                    </div>

                    <div>
                      <label className={labelCls}>Product Image URLs (comma-separated)</label>
                      <textarea value={form.images} onChange={e => set('images', e.target.value)}
                        className={inputCls + ' resize-none'} rows={4}
                        placeholder="https://images.unsplash.com/photo-xxx, https://..." />
                      <p className="text-white/30 text-xs mt-1 font-inter">
                        Tip: Use Unsplash URLs or upload to <a href="https://imgur.com" target="_blank" rel="noreferrer" className="text-gold-400 underline">imgur.com</a> and paste links here.
                      </p>
                    </div>

                    {/* Preview */}
                    {form.images && (
                      <div>
                        <label className={labelCls}>Image Preview</label>
                        <div className="flex gap-3 flex-wrap">
                          {form.images.split(',').map((url, i) => url.trim() && (
                            <img key={i} src={url.trim()} alt="preview"
                              className="w-24 h-24 rounded-xl object-cover border border-white/10"
                              onError={e => e.target.style.display = 'none'} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Tab: Nutrition ── */}
                {activeTab === 'nutrition' && (
                  <div className="flex flex-col gap-4">
                    <div className="glass rounded-2xl p-4 border border-green-500/20 mb-2">
                      <p className="text-green-400 text-sm font-outfit font-semibold mb-1">💪 Nutrition per serving</p>
                      <p className="text-white/40 text-xs font-inter">These values appear on product pages and nutrition calculator.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { key: 'protein', label: 'Protein (g)', placeholder: '22' },
                        { key: 'calories', label: 'Calories (kcal)', placeholder: '280' },
                        { key: 'carbs', label: 'Carbs (g)', placeholder: '30' },
                        { key: 'fat', label: 'Fat (g)', placeholder: '12' },
                        { key: 'fiber', label: 'Fiber (g)', placeholder: '3' },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className={labelCls}>{label}</label>
                          <input type="number" value={form[key]} onChange={e => set(key, e.target.value)}
                            className={inputCls} placeholder={placeholder} />
                        </div>
                      ))}
                      <div>
                        <label className={labelCls}>Shelf Life</label>
                        <input value={form.shelfLife} onChange={e => set('shelfLife', e.target.value)}
                          className={inputCls} placeholder="3 months" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Ingredients (comma-separated)</label>
                      <textarea value={form.ingredients} onChange={e => set('ingredients', e.target.value)}
                        className={inputCls + ' resize-none'} rows={3}
                        placeholder="Almonds, Oats, Honey, Dark Chocolate, Peanut Butter" />
                    </div>
                    <div>
                      <label className={labelCls}>Benefits (comma-separated)</label>
                      <textarea value={form.benefits} onChange={e => set('benefits', e.target.value)}
                        className={inputCls + ' resize-none'} rows={3}
                        placeholder="High Protein, No Added Sugar, Gluten Free, Post-Workout" />
                    </div>
                  </div>
                )}

                {/* ── Tab: Details & Tags ── */}
                {activeTab === 'details' && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <label className={labelCls}>Visibility & Promotion</label>
                      <div className="glass rounded-2xl p-4 flex flex-wrap gap-5">
                        <Toggle checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} label="Featured on Home" />
                        <Toggle checked={form.isBestSeller} onChange={e => set('isBestSeller', e.target.checked)} label="Best Seller" color="bg-gold-500" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Dietary Tags</label>
                      <div className="glass rounded-2xl p-4 flex flex-wrap gap-5">
                        <Toggle checked={form.isVegan} onChange={e => set('isVegan', e.target.checked)} label="🌿 Vegan" color="bg-emerald-500" />
                        <Toggle checked={form.isKeto} onChange={e => set('isKeto', e.target.checked)} label="🥑 Keto" color="bg-purple-500" />
                        <Toggle checked={form.isGlutenFree} onChange={e => set('isGlutenFree', e.target.checked)} label="✅ Gluten Free" color="bg-blue-500" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Footer Buttons ── */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
                  {activeTab !== 'basic' && (
                    <button type="button" onClick={() => {
                      const i = tabs.findIndex(t => t.id === activeTab)
                      setActiveTab(tabs[Math.max(0, i - 1)].id)
                    }} className="btn-secondary px-4 py-2 text-sm">← Back</button>
                  )}
                  {activeTab !== 'details' ? (
                    <button type="button" onClick={() => {
                      const i = tabs.findIndex(t => t.id === activeTab)
                      setActiveTab(tabs[Math.min(tabs.length - 1, i + 1)].id)
                    }} className="btn-primary px-6 py-2.5 text-sm ml-auto">Next →</button>
                  ) : (
                    <button type="submit" disabled={saving}
                      className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm ml-auto disabled:opacity-50">
                      {saving ? '⏳ Saving...' : <><FiCheck size={15} /> {editProduct ? 'Update Product' : 'Create Product'}</>}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      {loading ? <Loader /> : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  {['Product', 'Category', 'Price', 'Stock', 'Tags', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-white/40 text-xs font-outfit uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-16 text-white/30 font-inter">
                    No products yet. Click "Add Product" to get started!
                  </td></tr>
                )}
                {products.map(product => (
                  <tr key={product._id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=100'}
                          alt={product.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-white/10" />
                        <div>
                          <p className="text-white font-inter text-sm font-medium">{product.name}</p>
                          <p className="text-white/30 text-xs">/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/60 text-sm font-inter">{product.category?.name || '—'}</td>
                    <td className="px-5 py-4">
                      <p className="text-white font-outfit font-bold text-sm">₹{product.discountPrice > 0 ? product.discountPrice : product.price}</p>
                      {product.discountPrice > 0 && <p className="text-white/30 text-xs line-through">₹{product.price}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-sm font-inter font-semibold ${product.stock > 20 ? 'text-green-400' : product.stock > 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {product.stock} {product.stock <= 5 && '⚠️'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {product.isFeatured && <span className="badge bg-green-500/20 text-green-400 text-[10px]">Featured</span>}
                        {product.isBestSeller && <span className="badge bg-gold-500/20 text-gold-400 text-[10px]">Bestseller</span>}
                        {product.isVegan && <span className="badge bg-emerald-500/20 text-emerald-400 text-[10px]">Vegan</span>}
                        {product.isKeto && <span className="badge bg-purple-500/20 text-purple-400 text-[10px]">Keto</span>}
                        {product.isGlutenFree && <span className="badge bg-blue-500/20 text-blue-400 text-[10px]">GF</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(product)}
                          className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/50 hover:text-gold-400 hover:bg-gold-500/10 transition-all">
                          <FiEdit2 size={13} />
                        </button>
                        <button onClick={() => handleDelete(product._id)}
                          className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
