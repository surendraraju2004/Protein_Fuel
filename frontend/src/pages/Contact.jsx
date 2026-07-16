import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend, FiInstagram, FiFacebook } from 'react-icons/fi'
import api from '../api/axios'
import toast from 'react-hot-toast'

const faqs = [
  { q: 'How long do NutriBite bars stay fresh?', a: 'Our bars have a shelf life of 30-45 days when stored in a cool, dry place. Refrigeration extends shelf life to 90 days.' },
  { q: 'Are your bars suitable for diabetics?', a: 'Our Keto and Stevia-sweetened bars are suitable for most diabetics. Please consult your doctor as individual requirements vary.' },
  { q: 'Do you offer bulk orders for gyms/offices?', a: 'Yes! We offer special pricing for bulk orders of 50+ bars. Contact us at hello@nutribite.in for a custom quote.' },
  { q: 'Are your products certified?', a: 'All NutriBite bars are made in a FSSAI-compliant kitchen. We are working on organic certifications.' },
  { q: 'Do you ship across India?', a: 'Yes! We ship to all major Indian cities. Shipping time is 3-7 business days.' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent! We\'ll reply within 24 hours. 💌')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch { toast.error('Failed to send. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="pt-24 section-padding py-16">
      <div className="text-center mb-12">
        <span className="badge-gold mb-4 inline-block">Contact Us</span>
        <h1 className="section-title text-white mb-3">We'd Love to <span className="text-gradient-gold">Hear From You</span></h1>
        <p className="section-subtitle mx-auto text-center">Have a question, bulk order inquiry, or just want to say hi? We reply within 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
        {/* Contact Info */}
        <div className="flex flex-col gap-6">
          {[
            { icon: <FiMail className="text-gold-400" size={20} />, title: 'Email Us', value: 'hello@nutribite.in', href: 'mailto:hello@nutribite.in' },
            { icon: <FiPhone className="text-green-400" size={20} />, title: 'Call Us', value: '+91 98765 43210', href: 'tel:+919876543210' },
            { icon: <FiMapPin className="text-blue-400" size={20} />, title: 'Location', value: 'Mumbai, Maharashtra, India', href: '#' },
          ].map(({ icon, title, value, href }) => (
            <a key={title} href={href} className="glass rounded-2xl p-5 flex items-center gap-4 hover:bg-white/5 transition-colors group">
              <div className="w-10 h-10 glass rounded-xl flex items-center justify-center flex-shrink-0">{icon}</div>
              <div>
                <p className="text-white/50 text-xs font-outfit uppercase tracking-wider">{title}</p>
                <p className="text-white font-inter font-medium group-hover:text-gold-400 transition-colors">{value}</p>
              </div>
            </a>
          ))}

          <div className="glass rounded-2xl p-5">
            <p className="text-white/50 text-xs font-outfit uppercase tracking-wider mb-3">Follow Us</p>
            <div className="flex gap-3">
              {[<FiInstagram />, <FiFacebook />].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white/50 hover:text-gold-400 hover:bg-white/5 transition-all">{icon}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 glass rounded-3xl p-8">
          <h2 className="font-outfit font-bold text-white text-xl mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                { key: 'phone', label: 'Phone (optional)', type: 'tel', placeholder: '10-digit mobile' },
                { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Bulk order / Query / Feedback' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-1.5">{label}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(f => ({...f, [key]: e.target.value}))}
                    placeholder={placeholder} className="input-style" required={key !== 'phone'} />
                </div>
              ))}
            </div>
            <div>
              <label className="text-white/60 text-xs font-outfit uppercase tracking-wider block mb-1.5">Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                placeholder="Tell us what's on your mind..." rows={5} className="input-style resize-none" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 w-fit disabled:opacity-50">
              {loading ? 'Sending...' : <><FiSend size={15} /> Send Message</>}
            </button>
          </form>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="font-outfit font-bold text-white text-2xl text-center mb-8">Frequently Asked <span className="text-gradient-gold">Questions</span></h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-outfit font-semibold text-white text-sm">{faq.q}</span>
                <span className={`text-gold-400 text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {openFaq === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
                  className="px-5 pb-5 text-white/60 font-inter text-sm leading-relaxed border-t border-white/10 pt-4">
                  {faq.a}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
