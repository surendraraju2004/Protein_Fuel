import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFilter, FiX, FiSearch, FiGrid, FiList, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/productSlice'
import ProductCard from '../components/products/ProductCard'
import Loader from '../components/ui/Loader'
import api from '../api/axios'

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
]

const dietaryFilters = [
  { key: 'isVegan', label: '🌿 Vegan' },
  { key: 'isGlutenFree', label: 'Gluten Free' },
  { key: 'isKeto', label: '🥑 Keto' },
  { key: 'isFeatured', label: '⭐ Featured' },
  { key: 'isBestSeller', label: '🔥 Bestseller' },
]

export default function Products() {
  const dispatch = useDispatch()
  const { items: products, loading, total, pages } = useSelector(s => s.products)
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState('grid')

  // Filters from URL
  const currentPage = Number(searchParams.get('page')) || 1
  const currentCategory = searchParams.get('category') || ''
  const currentSearch = searchParams.get('search') || ''
  const currentSort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const [localSearch, setLocalSearch] = useState(currentSearch)
  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice })

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const params = {}
    if (currentPage > 1) params.page = currentPage
    if (currentCategory) params.category = currentCategory
    if (currentSearch) params.search = currentSearch
    if (currentSort) params.sort = currentSort
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    dispatch(fetchProducts(params))
  }, [searchParams, dispatch])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    setSearchParams(params)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    updateFilter('search', localSearch)
  }

  const clearAllFilters = () => {
    setSearchParams({})
    setLocalSearch('')
    setPriceRange({ min: '', max: '' })
  }

  const hasFilters = currentCategory || currentSearch || minPrice || maxPrice

  return (
    <div className="pt-24 min-h-screen section-padding py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title text-white mb-2">
          All <span className="text-gradient-gold">Products</span>
        </h1>
        <p className="text-white/50 font-inter">
          {loading ? 'Loading...' : `${total} products found`}
          {currentSearch && <span className="text-gold-400"> for "{currentSearch}"</span>}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className={`
          lg:w-64 flex-shrink-0 
          fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto
          ${sidebarOpen ? 'block' : 'hidden lg:block'}
        `}>
          <div className="glass-dark rounded-2xl p-6 lg:sticky lg:top-24 h-full lg:h-auto overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-outfit font-bold text-white text-lg">Filters</h3>
              <div className="flex items-center gap-2">
                {hasFilters && (
                  <button onClick={clearAllFilters} className="text-red-400 hover:text-red-300 text-xs font-inter">Clear all</button>
                )}
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white">
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-2">Search</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localSearch}
                  onChange={e => setLocalSearch(e.target.value)}
                  placeholder="Search bars..."
                  className="input-style text-sm flex-1"
                />
                <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-3 rounded-xl transition-colors">
                  <FiSearch size={15} />
                </button>
              </div>
            </form>

            {/* Categories */}
            <div className="mb-6">
              <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-3">Category</label>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => updateFilter('category', '')}
                  className={`text-left py-2 px-3 rounded-xl text-sm font-inter transition-all ${!currentCategory ? 'bg-green-600/20 text-gold-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`text-left py-2 px-3 rounded-xl text-sm font-inter transition-all ${currentCategory === cat.slug ? 'bg-green-600/20 text-gold-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-3">Price Range (₹)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))}
                  placeholder="Min"
                  className="input-style text-sm"
                  min={0}
                />
                <span className="text-white/30">–</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))}
                  placeholder="Max"
                  className="input-style text-sm"
                  min={0}
                />
              </div>
              <button
                onClick={() => {
                  updateFilter('minPrice', priceRange.min)
                  updateFilter('maxPrice', priceRange.max)
                }}
                className="mt-2 w-full py-2 glass rounded-xl text-white/70 hover:text-white text-sm font-inter transition-colors"
              >
                Apply Price
              </button>
            </div>

            {/* Sort */}
            <div>
              <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-3">Sort By</label>
              <div className="flex flex-col gap-1">
                {sortOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => updateFilter('sort', opt.value)}
                    className={`text-left py-2 px-3 rounded-xl text-sm font-inter transition-all ${currentSort === opt.value ? 'bg-green-600/20 text-gold-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 glass rounded-xl px-4 py-2 text-white/70 text-sm font-inter"
            >
              <FiFilter size={15} /> Filters
              {hasFilters && <span className="w-2 h-2 bg-gold-400 rounded-full" />}
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-green-600/20 text-gold-400' : 'text-white/40 hover:text-white'}`}>
                <FiGrid size={18} />
              </button>
              <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-green-600/20 text-gold-400' : 'text-white/40 hover:text-white'}`}>
                <FiList size={18} />
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {currentSearch && (
                <span className="flex items-center gap-1 badge-gold text-xs">
                  Search: {currentSearch}
                  <button onClick={() => updateFilter('search', '')}><FiX size={10} /></button>
                </span>
              )}
              {currentCategory && (
                <span className="flex items-center gap-1 badge-gold text-xs">
                  {categories.find(c => c.slug === currentCategory)?.name || currentCategory}
                  <button onClick={() => updateFilter('category', '')}><FiX size={10} /></button>
                </span>
              )}
            </div>
          )}

          {/* Products */}
          {loading ? (
            <Loader text="Loading products..." />
          ) : products.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl">
              <div className="text-5xl mb-4">🥜</div>
              <h3 className="font-outfit font-bold text-white text-xl mb-2">No products found</h3>
              <p className="text-white/50 font-inter mb-6">Try adjusting your filters or search term</p>
              <button onClick={clearAllFilters} className="btn-secondary">Clear Filters</button>
            </div>
          ) : (
            <div className={view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
            }>
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => updateFilter('page', p)}
                  className={`w-10 h-10 rounded-xl font-outfit font-semibold text-sm transition-all ${currentPage === p ? 'bg-gold-500 text-green-950' : 'glass text-white/60 hover:text-white hover:bg-white/10'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
