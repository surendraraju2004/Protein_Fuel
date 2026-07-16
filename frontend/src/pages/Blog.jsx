import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock, FiArrowRight } from 'react-icons/fi'
import api from '../api/axios'
import Loader from '../components/ui/Loader'

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/blog').then(r => setPosts(r.data)).catch(() => setPosts([])).finally(() => setLoading(false))
  }, [])

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="pt-24 section-padding py-16">
      <div className="text-center mb-12">
        <span className="badge-gold mb-4 inline-block">Blog</span>
        <h1 className="section-title text-white mb-3">Fuel Your <span className="text-gradient-gold">Knowledge</span></h1>
        <p className="section-subtitle mx-auto text-center">Nutrition tips, fitness guides, and healthy eating inspiration.</p>
      </div>

      {loading ? <Loader /> : (
        <>
          {/* Featured Post */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <Link to={`/blog/${featured.slug}`} className="block glass rounded-3xl overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="aspect-video lg:aspect-auto overflow-hidden">
                    <img src={featured.coverImage || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800'}
                      alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="badge-gold mb-4 inline-block">{featured.category}</span>
                    <h2 className="font-outfit font-black text-2xl sm:text-3xl text-white mb-4 group-hover:text-gold-400 transition-colors">{featured.title}</h2>
                    <p className="text-white/60 font-inter leading-relaxed mb-6 line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/40 text-sm font-inter">
                        <FiClock size={13} /> {featured.readTime} min read
                      </div>
                      <span className="flex items-center gap-2 text-gold-400 font-outfit font-semibold text-sm group-hover:gap-3 transition-all">
                        Read More <FiArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Rest Posts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(rest.length > 0 ? rest : []).map((post, i) => (
              <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={`/blog/${post.slug}`} className="block glass rounded-2xl overflow-hidden card-hover group">
                  <div className="aspect-video overflow-hidden">
                    <img src={post.coverImage || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600'}
                      alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <span className="badge-green mb-3 inline-block text-[11px]">{post.category}</span>
                    <h3 className="font-outfit font-bold text-white mb-2 line-clamp-2 group-hover:text-gold-400 transition-colors">{post.title}</h3>
                    <p className="text-white/50 text-sm font-inter line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-white/30 font-inter">
                      <span><FiClock size={11} className="inline mr-1" />{post.readTime} min</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-20 glass rounded-3xl">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-white/50 font-inter">Blog posts coming soon!</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
