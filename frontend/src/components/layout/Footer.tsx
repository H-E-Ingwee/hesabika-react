import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Heart, Mail, Phone, MapPin } from 'lucide-react'
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
  { icon: Facebook, href: SITE_CONFIG.social.facebook, label: 'Facebook' },
  { icon: Twitter, href: SITE_CONFIG.social.twitter, label: 'Twitter' },
  { icon: Instagram, href: SITE_CONFIG.social.instagram, label: 'Instagram' },
  { icon: Youtube, href: SITE_CONFIG.social.youtube, label: 'YouTube' },
  { icon: Linkedin, href: SITE_CONFIG.social.linkedin, label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-[#080808] pt-20 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img
              src="/images/logo.png"
              alt="Hesabika Trust"
              className="h-11 w-auto mb-2 brightness-0 invert"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
            <p className="text-brand-green text-xs font-bold uppercase tracking-widest mb-4">
              FOCUS Kenya — Societal Transformation Arm
            </p>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Hesabika Trust is a catalyst for value-driven socio-economic transformation of Kenya — translating concern into action since 2016.
            </p>

            {/* Contact mini */}
            <div className="space-y-2 mb-6">
              <a href={`tel:${SITE_CONFIG.phone}`} className="flex items-center gap-2 text-white/40 text-xs hover:text-white/70 transition-colors">
                <Phone size={12} />
                {SITE_CONFIG.phone}
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2 text-white/40 text-xs hover:text-white/70 transition-colors">
                <Mail size={12} />
                {SITE_CONFIG.email}
              </a>
              <div className="flex items-start gap-2 text-white/40 text-xs">
                <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                <span>{SITE_CONFIG.address}</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full bg-white/6 flex items-center justify-center text-white/50 hover:bg-brand-red hover:text-white transition-all duration-200"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h5 className="text-white text-xs font-bold tracking-widest uppercase mb-5">
                {title}
              </h5>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/40 text-sm hover:text-white transition-all duration-150 hover:pl-1 block"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={`text-sm hover:text-white transition-all duration-150 hover:pl-1 block ${
                          'highlight' in link && link.highlight
                            ? 'text-brand-green font-semibold'
                            : 'text-white/40'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* MPESA giving strip */}
        <div className="py-5 border-b border-white/6">
          <div className="flex flex-wrap items-center gap-6 text-xs text-white/30">
            <span className="font-semibold text-white/50 uppercase tracking-wider">Support via MPESA:</span>
            <span>Paybill: <strong className="text-white/60">{SITE_CONFIG.mpesa_paybill}</strong></span>
            <span>Account: <strong className="text-white/60">{SITE_CONFIG.mpesa_account}</strong></span>
            <span className="hidden sm:inline">|</span>
            <span>Bank: <strong className="text-white/60">{SITE_CONFIG.bank_account_number}</strong> ({SITE_CONFIG.bank_name})</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-5 gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Hesabika Trust | FOCUS Kenya. All Rights Reserved.
          </p>
          <p className="text-white/25 text-xs flex items-center gap-1">
            Designed with <Heart size={11} className="text-brand-red fill-brand-red" /> for Kenya's Transformation
          </p>
        </div>
      </div>
    </footer>
  )
}