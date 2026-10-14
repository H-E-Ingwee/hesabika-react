import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Heart, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

const footerLinks = {
  About: [
    { label: 'About Us', href: '/about' },
    { label: 'Board of Trustees', href: '/about/board' },
    { label: 'Secretariat', href: '/about/secretariat' },
    { label: 'Contact', href: '/contact' },
  ],
  Programmes: [
    { label: 'ELPro (New)', href: '/elpro', highlight: true },
    { label: 'GIPro Alumni', href: '/gipro' },
    { label: 'Caucuses', href: '/caucuses' },
    { label: 'Advocacy', href: '/advocacy' },
    { label: 'Initiatives', href: '/initiatives' },
    { label: 'Church & Politics', href: 'https://churchandpolitics.hesabika.com/', external: true },
  ],
  'Get Involved': [
    { label: 'Join ELPro', href: '/get-involved#elpro' },
    { label: 'Give / Donate', href: '/get-involved#give' },
    { label: 'Become a Mentor', href: '/get-involved#mentor' },
    { label: 'Careers', href: '/get-involved#careers' },
    { label: 'Blog & Resources', href: '/blog' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: SITE_CONFIG.social.facebook, label: 'Facebook', color: '#1877f2' },
  { icon: Twitter, href: SITE_CONFIG.social.twitter, label: 'Twitter', color: '#1da1f2' },
  { icon: Instagram, href: SITE_CONFIG.social.instagram, label: 'Instagram', color: '#e1306c' },
  { icon: Youtube, href: SITE_CONFIG.social.youtube, label: 'YouTube', color: '#ff0000' },
  { icon: Linkedin, href: SITE_CONFIG.social.linkedin, label: 'LinkedIn', color: '#0077b5' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#080808' }}>
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-red/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-0">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Brand col */}
          <div className="lg:col-span-2">
            <img src="/images/logo.png" alt="Hesabika Trust"
              className="h-10 w-auto mb-2 brightness-0 invert"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#166935' }}>
              FOCUS Kenya — Societal Transformation Arm
            </p>
            <p className="text-sm leading-relaxed max-w-xs mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Hesabika Trust is a catalyst for value-driven socio-economic transformation of Kenya — translating concern into action since 2016.
            </p>

            {/* Contact */}
            <div className="space-y-2 mb-6">
              {[
                { icon: Phone, text: SITE_CONFIG.phone, href: `tel:${SITE_CONFIG.phone}` },
                { icon: Mail, text: SITE_CONFIG.email, href: `mailto:${SITE_CONFIG.email}` },
                { icon: MapPin, text: SITE_CONFIG.address, href: undefined },
              ].map(({ icon: Icon, text, href }) => (
                <div key={text} className="flex items-start gap-2">
                  <Icon size={12} className="mt-0.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  {href ? (
                    <a href={href} className="text-xs transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.4)' }}>{text}</a>
                  ) : (
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{text}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = color + '22'
                    ;(e.currentTarget as HTMLElement).style.color = color
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'
                  }}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h5 className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {title}
              </h5>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer"
                        className="text-sm flex items-center gap-1 transition-all duration-150 hover:pl-1"
                        style={{ color: 'rgba(255,255,255,0.38)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.38)')}>
                        {link.label} <ArrowUpRight size={11} className="opacity-50" />
                      </a>
                    ) : (
                      <Link to={link.href}
                        className="text-sm block transition-all duration-150 hover:pl-1"
                        style={{ color: 'highlight' in link && link.highlight ? '#166935' : 'rgba(255,255,255,0.38)', fontWeight: 'highlight' in link && link.highlight ? '600' : '400' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'highlight' in link && link.highlight ? '#166935' : 'rgba(255,255,255,0.38)')}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* MPESA strip */}
        <div className="py-4 flex flex-wrap items-center gap-5 text-xs"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.28)' }}>
          <span className="font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>Support via MPESA:</span>
          <span>Paybill: <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{SITE_CONFIG.mpesa_paybill}</strong></span>
          <span>Account: <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{SITE_CONFIG.mpesa_account}</strong></span>
          <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
          <span>Bank: <strong style={{ color: 'rgba(255,255,255,0.6)' }}>{SITE_CONFIG.bank_account_number}</strong></span>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-5 gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
            © {new Date().getFullYear()} Hesabika Trust | FOCUS Kenya. All Rights Reserved.
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Designed with <Heart size={10} className="text-brand-red fill-brand-red" /> for Kenya's Transformation
          </p>
        </div>
      </div>
    </footer>
  )
}