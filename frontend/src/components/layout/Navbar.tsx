import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, ExternalLink } from 'lucide-react'
import { NAV_LINKS } from '@/lib/data'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/97 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white/95 backdrop-blur-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[76px]">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="Hesabika Trust"
                className="h-11 w-auto"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.style.display = 'none'
                }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5" ref={dropdownRef}>
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive(link.href)
                        ? 'text-brand-green bg-brand-green/8'
                        : 'text-gray-700 hover:text-brand-green hover:bg-brand-green/5'
                    )}
                  >
                    {link.label}
                    {/* ELPro badge */}
                    {link.label === 'Programmes' && (
                      <span className="ml-1 text-[9px] font-black bg-brand-red text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">New</span>
                    )}
                    {link.children && (
                      <ChevronDown
                        size={13}
                        className={cn(
                          'transition-transform duration-200',
                          activeDropdown === link.label ? 'rotate-180' : ''
                        )}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        {link.children.map((child) =>
                          child.external ? (
                            <a
                              key={child.label}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:text-brand-green hover:bg-brand-green/5 border-b border-gray-50 last:border-0 transition-all duration-150 hover:pl-5"
                            >
                              {child.label}
                              <ExternalLink size={12} className="opacity-50" />
                            </a>
                          ) : (
                            <Link
                              key={child.label}
                              to={child.href}
                              className={cn(
                                'flex items-center justify-between px-4 py-2.5 text-sm border-b border-gray-50 last:border-0 transition-all duration-150 hover:pl-5',
                                child.label.includes('ELPro')
                                  ? 'text-brand-green font-semibold hover:bg-brand-green/5'
                                  : 'text-gray-700 hover:text-brand-green hover:bg-brand-green/5'
                              )}
                            >
                              <span>{child.label}</span>
                              {child.label.includes('ELPro') && (
                                <span className="text-[9px] font-black bg-brand-red text-white px-1.5 py-0.5 rounded-full uppercase">New</span>
                              )}
                            </Link>
                          )
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                to="/elpro"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-brand-green border border-brand-green/30 bg-brand-green/5 px-3 py-1.5 rounded-full hover:bg-brand-green hover:text-white transition-all duration-200"
              >
                ELPro ✦
              </Link>
              <Link
                to="/get-involved"
                className="hidden lg:inline-flex btn-primary text-sm py-2.5 px-5"
              >
                Get Involved
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 top-[76px] z-40 bg-white overflow-y-auto lg:hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileExpanded(
                            mobileExpanded === link.label ? null : link.label
                          )
                        }
                        className="w-full flex items-center justify-between py-3 text-base font-semibold text-gray-800 border-b border-gray-100"
                      >
                        <span className="flex items-center gap-2">
                          {link.label}
                          {link.label === 'Programmes' && (
                            <span className="text-[9px] font-black bg-brand-red text-white px-1.5 py-0.5 rounded-full uppercase">New</span>
                          )}
                        </span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            'transition-transform duration-200',
                            mobileExpanded === link.label ? 'rotate-180' : ''
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4"
                          >
                            {link.children.map((child) =>
                              child.external ? (
                                <a
                                  key={child.label}
                                  href={child.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 py-2.5 text-sm text-gray-600 border-b border-gray-50"
                                >
                                  {child.label}
                                  <ExternalLink size={11} className="opacity-50" />
                                </a>
                              ) : (
                                <Link
                                  key={child.label}
                                  to={child.href}
                                  className={cn(
                                    'flex items-center justify-between py-2.5 text-sm border-b border-gray-50',
                                    child.label.includes('ELPro') ? 'text-brand-green font-semibold' : 'text-gray-600'
                                  )}
                                >
                                  {child.label}
                                  {child.label.includes('ELPro') && (
                                    <span className="text-[9px] font-black bg-brand-red text-white px-1.5 py-0.5 rounded-full uppercase">New</span>
                                  )}
                                </Link>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className="block py-3 text-base font-semibold text-gray-800 border-b border-gray-100"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-6 space-y-3">
                <Link to="/elpro" className="btn-outline-green w-full justify-center">
                  ELPro — Ethical Leaders Program ✦
                </Link>
                <Link to="/get-involved" className="btn-primary w-full justify-center">
                  Get Involved
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}