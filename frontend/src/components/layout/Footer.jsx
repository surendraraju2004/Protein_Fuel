import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

const footerLinks = {
  'Shop': [
    { label: 'All Products', path: '/products' },
    { label: 'Protein Bars', path: '/products?category=protein-bars' },
    { label: 'Energy Bars', path: '/products?category=energy-bars' },
    { label: 'Vegan Bars', path: '/products?category=vegan' },
    { label: 'Keto Bars', path: '/products?category=keto' },
    { label: 'Kids Bars', path: '/products?category=kids-bars' },
  ],
  'Features': [
    { label: 'Build Your Bar', path: '/build-your-bar' },
    { label: 'Nutrition Calculator', path: '/nutrition-calculator' },
    { label: 'Subscription Plans', path: '/subscription' },
    { label: 'Compare Products', path: '/compare' },
  ],
  'Company': [
    { label: 'About Us', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ],
}

const trustBadges = [
  { icon: '🌿', label: '100% Natural' },
  { icon: '💪', label: 'High Protein' },
  { icon: '🚫', label: 'No Preservatives' },
  { icon: '🍯', label: 'No Added Sugar' },
  { icon: '🇮🇳', label: 'Made in India' },
]

export default function Footer() {
  return (
    <footer className="relative bg-green-950 border-t border-white/10 mt-20">
      {/* Top decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      {/* Trust Badges Strip */}
      <div className="border-b border-white/5 py-6">
        <div className="section-padding">
          <div className="flex flex-wrap justify-center gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 glass rounded-full px-4 py-2">
                <span className="text-lg">{badge.icon}</span>
                <span className="text-white/80 text-sm font-inter font-medium whitespace-nowrap">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-green-950 font-outfit font-black text-xl shadow-glow-gold">
                N
              </div>
              <span className="font-outfit font-bold text-2xl text-white">
                Nutri<span className="text-gradient-gold">Bite</span>
              </span>
            </Link>
            <p className="text-white/50 font-inter text-sm leading-relaxed mb-6 max-w-xs">
              Handcrafted protein bars made with love and the finest natural ingredients.
              Fuel your body the right way — no preservatives, no shortcuts.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 mb-6">
              <a href="mailto:hello@nutribite.in" className="flex items-center gap-2 text-white/50 hover:text-gold-400 transition-colors text-sm font-inter">
                <FiMail size={14} /> hello@nutribite.in
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-white/50 hover:text-gold-400 transition-colors text-sm font-inter">
                <FiPhone size={14} /> +91 98765 43210
              </a>
              <span className="flex items-center gap-2 text-white/50 text-sm font-inter">
                <FiMapPin size={14} /> Mumbai, Maharashtra, India
              </span>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: <FiInstagram size={16} />, href: '#', label: 'Instagram' },
                { icon: <FiFacebook size={16} />, href: '#', label: 'Facebook' },
                { icon: <FiTwitter size={16} />, href: '#', label: 'Twitter' },
                { icon: <FiYoutube size={16} />, href: '#', label: 'YouTube' },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-white/50 hover:text-gold-400 hover:border-gold-500/30 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-outfit font-semibold text-white text-sm mb-4 uppercase tracking-wider">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-white/50 hover:text-gold-400 transition-colors font-inter text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-6">
        <div className="section-padding flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm font-inter">
            © {new Date().getFullYear()} NutriBite. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/30 text-sm font-inter">
            <span>💚</span>
            <span>Made with love in India</span>
          </div>
          <div className="flex items-center gap-4">
            <img src="https://img.icons8.com/color/28/upi-payment.png" alt="UPI" className="h-5 opacity-50 hover:opacity-80 transition-opacity" />
            <img src="https://img.icons8.com/color/28/mastercard-logo.png" alt="Mastercard" className="h-5 opacity-50 hover:opacity-80 transition-opacity" />
            <img src="https://img.icons8.com/color/28/visa.png" alt="Visa" className="h-5 opacity-50 hover:opacity-80 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  )
}
