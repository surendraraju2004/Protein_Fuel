import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiUsers, FiAward, FiHeart, FiInstagram, FiCode } from 'react-icons/fi'

const milestones = [
  { year: 'Jan 2026', event: 'NutriBite was born! Sai Prameela launched the first batch of handmade protein bars from her home kitchen — sold out in days.' },
  { year: 'Feb 2026', event: 'Shared the journey on Instagram. The community response was overwhelming — hundreds of DMs, reorders, and word-of-mouth love.' },
  { year: 'Mar 2026', event: 'Expanded to 5 flavors and started taking bulk orders for gyms, offices & fitness communities.' },
  { year: 'Mid 2026', event: '1000+ happy customers. Featured by fellow creators. NutriBite is now a movement, not just a product.' },
]

const values = [
  { icon: '🌿', title: 'Clean Ingredients', desc: 'Every ingredient is handpicked. If we wouldn\'t eat it ourselves, we won\'t sell it.' },
  { icon: '💚', title: 'Health First', desc: 'We never compromise nutrition for taste. Both can coexist beautifully.' },
  { icon: '🤝', title: 'Transparency', desc: 'Full ingredient list, clear labeling, honest nutrition data. Always.' },
  { icon: '🌍', title: 'Made with Love', desc: 'Small-batch, handcrafted bars — not factory lines. You can taste the difference.' },
]

export default function About() {
  return (
    <div className="pt-24 overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="section-padding py-20 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-green-950 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <span className="badge-gold mb-4 inline-block">Our Story</span>
          <h1 className="section-title text-white mb-6">
            From Instagram to Your<br />
            <span className="text-gradient-gold">Protein Bar</span>
          </h1>
          <p className="text-white/65 font-inter text-lg leading-relaxed">
            NutriBite was born out of a simple belief — that healthy snacking should be
            real, honest, and delicious. What started as a passion project by a software
            engineer and content creator in January 2026 quickly turned into a community-backed movement.
          </p>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="section-padding py-12 bg-green-950 border-y border-white/5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { number: '1K+', label: 'Happy Customers', icon: <FiUsers className="text-gold-400" /> },
            { number: '10+', label: 'Bar Flavors', icon: '🥜' },
            { number: '100%', label: 'Natural Always', icon: '🌿' },
            { number: '4.9★', label: 'Customer Love', icon: <FiAward className="text-gold-400" /> },
          ].map(({ number, label, icon }) => (
            <div key={label} className="text-center">
              <div className="text-2xl mb-2">{icon}</div>
              <div className="font-outfit font-black text-3xl text-gradient-gold">{number}</div>
              <div className="text-white/50 font-inter text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Founder Story ── */}
      <section className="section-padding py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center max-w-6xl mx-auto">

          {/* Founder photo - large */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow backdrop */}
            <div className="absolute -inset-4 bg-gold-500/10 rounded-3xl blur-2xl pointer-events-none" />
            <div className="relative rounded-3xl overflow-hidden border-2 border-gold-500/30"
              style={{ boxShadow: '0 0 0 1px rgba(212,160,23,0.1), 0 30px 60px rgba(0,0,0,0.5)' }}>
              <img
                src="/founder.jpg"
                alt="Sai Prameela Vetukuri — Founder, NutriBite"
                className="w-full object-cover object-center"
                style={{ maxHeight: '480px' }}
              />
              {/* Bottom overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5"
                style={{ background: 'linear-gradient(to top, rgba(15,35,24,0.95), transparent)' }}>
                <p className="font-outfit font-bold text-white text-lg">Sai Prameela Vetukuri</p>
                <p className="text-gold-400 text-sm font-inter">Founder, NutriBite · Software Engineer · Instagram Creator</p>
              </div>
              {/* Corner badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 glass rounded-full px-3 py-1.5 border border-gold-500/30">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gold-400 text-xs font-outfit font-semibold">Founder</span>
              </div>
            </div>
          </motion.div>

          {/* Story text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge-green mb-4 inline-block">Meet the Founder</span>
            <h2 className="section-title text-white mb-5">
              A Software Engineer<br />
              <span className="text-gradient-gold">Who Chose Real Food.</span>
            </h2>

            {/* Quote */}
            <blockquote className="font-outfit font-semibold text-white/90 text-base italic leading-relaxed mb-6 border-l-2 border-gold-500/60 pl-4 py-1">
              "I started making protein bars for myself — and when my followers tried them, they wouldn't stop asking for more. That's when I knew NutriBite had to be real."
              <cite className="block text-gold-400 font-inter not-italic text-sm mt-2">— Sai Prameela Vetukuri</cite>
            </blockquote>

            <p className="text-white/70 font-inter leading-relaxed mb-4">
              Sai Prameela Vetukuri is a software professional by day and a passionate Instagram content creator by heart.
              On her social media, she shares the things she loves most — fashion, food, and the beauty of everyday living.
              With thousands of followers who trust her taste and authenticity, she built a community that values real, intentional choices.
            </p>

            <p className="text-white/70 font-inter leading-relaxed mb-4">
              In <span className="text-gold-400 font-semibold">January 2026</span>, she channeled that same authenticity into something
              she had been thinking about for a while — handmade protein bars with zero artificial ingredients.
              Made from scratch, packed with natural goodness, and crafted the same way she approaches everything: with care and purpose.
            </p>

            <p className="text-white/70 font-inter leading-relaxed mb-6">
              The response was <span className="text-green-400 font-semibold">beyond anything she expected</span>.
              Her community rallied behind her, orders flooded in, reels went viral, and NutriBite quickly became
              more than a side project — it became a brand people genuinely love and trust.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Shop the Bars <FiArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-secondary inline-flex items-center gap-2">
                Say Hello
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="section-padding py-16 bg-green-950/50">
        <div className="text-center mb-12">
          <span className="badge-gold mb-4 inline-block">What We Stand For</span>
          <h2 className="section-title text-white mb-3">Our <span className="text-gradient-gold">Values</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 text-center hover:border-green-600/40 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="font-outfit font-bold text-white mb-2">{v.title}</h3>
              <p className="text-white/50 font-inter text-sm">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Journey Timeline ── */}
      <section className="section-padding py-16">
        <div className="text-center mb-12">
          <span className="badge-green mb-4 inline-block">The Journey</span>
          <h2 className="section-title text-white mb-3">How It All <span className="text-gradient-gold">Began</span></h2>
        </div>
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-900" />
          {milestones.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex gap-6 mb-8 pl-12 relative"
            >
              <div className="absolute left-0 w-8 h-8 rounded-full bg-green-900 border-2 border-gold-500 flex items-center justify-center text-xs font-outfit font-bold text-gold-400">
                {i + 1}
              </div>
              <div>
                <span className="text-gold-400 font-outfit font-bold text-sm">{m.year}</span>
                <p className="text-white/70 font-inter text-sm mt-1 leading-relaxed">{m.event}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Instagram Banner ── */}
      <section className="section-padding py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 sm:p-10 border border-gold-500/20 max-w-3xl mx-auto text-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -left-10 w-52 h-52 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
          <FiInstagram size={36} className="text-gold-400 mx-auto mb-4" />
          <h2 className="font-outfit font-black text-2xl sm:text-3xl text-white mb-3">
            Follow Sai Prameela's Journey
          </h2>
          <p className="text-white/60 font-inter mb-6 text-sm sm:text-base">
            From fashion & food to building NutriBite — follow along on Instagram for behind-the-scenes,
            new flavors, daily living inspiration, and a whole lot of good energy. ✨
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn-primary">Try Our Bars</Link>
            <Link to="/contact" className="btn-secondary">Get in Touch</Link>
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding py-16">
        <div className="glass rounded-3xl p-10 text-center border border-gold-500/20 max-w-2xl mx-auto">
          <FiHeart size={32} className="text-red-400 mx-auto mb-4" />
          <h2 className="font-outfit font-black text-3xl text-white mb-3">Join the NutriBite Family</h2>
          <p className="text-white/60 font-inter mb-6">
            Started in 2026, backed by a community that believes in real food and honest living.
            Be part of the story.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/contact" className="btn-secondary">Get in Touch</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
