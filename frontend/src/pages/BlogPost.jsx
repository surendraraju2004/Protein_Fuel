import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiClock, FiArrowLeft } from 'react-icons/fi'
import api from '../api/axios'
import Loader from '../components/ui/Loader'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/blog/${slug}`).then(r => setPost(r.data)).catch(() => setPost(null)).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="pt-28"><Loader /></div>
  if (!post) return (
    <div className="pt-28 text-center py-20">
      <h2 className="text-white font-outfit font-bold text-2xl mb-4">Post not found</h2>
      <Link to="/blog" className="btn-primary">← Back to Blog</Link>
    </div>
  )

  return (
    <div className="pt-24 section-padding py-12 max-w-3xl mx-auto">
      <Link to="/blog" className="flex items-center gap-2 text-white/50 hover:text-gold-400 font-inter text-sm mb-8 transition-colors">
        <FiArrowLeft size={15} /> Back to Blog
      </Link>

      {/* Cover */}
      <div className="rounded-3xl overflow-hidden mb-8 aspect-video">
        <img src={post.coverImage || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800'}
          alt={post.title} className="w-full h-full object-cover" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <span className="badge-gold">{post.category}</span>
        <span className="text-white/30 text-xs font-inter flex items-center gap-1"><FiClock size={11} /> {post.readTime} min read</span>
        <span className="text-white/30 text-xs font-inter">{new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      <h1 className="font-outfit font-black text-3xl sm:text-4xl text-white mb-4 leading-tight">{post.title}</h1>

      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-gold-500 flex items-center justify-center text-white font-bold text-sm">
          {post.author?.[0] || 'N'}
        </div>
        <div>
          <p className="text-white font-outfit font-semibold text-sm">{post.author || 'NutriBite Team'}</p>
          <p className="text-white/40 text-xs font-inter">Author</p>
        </div>
      </div>

      <div className="prose-dark" dangerouslySetInnerHTML={{ __html: post.content }} />

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link key={tag} to={`/blog?tag=${tag}`} className="tag-pill hover:border-gold-500/40 hover:text-gold-400 transition-colors">#{tag}</Link>
          ))}
        </div>
      )}
    </div>
  )
}
