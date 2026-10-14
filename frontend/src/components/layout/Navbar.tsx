import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown, ExternalLink, Sun, Moon } from 'lucide-react'
import { NAV_LINKS } from '@/lib/data'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const location = useLocation()
  const { theme, toggle, isDark } = useTheme()

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
            ? 'shadow-md border-b'
            : 'border-b border-transparent'
        )}
        style={{
          background: 'var(--nav-bg)',
          borderColor: scrolled ? 'var(--nav-border)' : 'transparent',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        }}
      >
        {/* Top accent line */}
        <div className="h-0.5 bg-gradient-to-r from-brand-red via-brand-green to-brand-red opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <img
                src="/images/logo.png"
                alt="Hesabika Trust"
                className={cn('h-10 w-auto transition-all duration-300 group-hover:scale-105', isDark && 'brightness-0 invert')}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0.5">
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
                      'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative',
                      isActive(link.href)
                        ? 'text-brand-green'
                        : 'hover:text-brand-green'
                    )}
                    style={{ color: isActive(link.href) ? 'var(--brand-green)' : 'var(--text-secondary)' }}
                  >
                    {link.label}
                    {link.label === 'Programmes' && (
                      <span className="text-[9px] font-black bg-brand-red text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide leading-none">
                        New
                      </span>
                    )}
                    {link.children && (
                      <ChevronDown
                        size={13}
                        className={cn('transition-transform duration-200', activeDropdown === link.label ? 'rotate-180' : '')}
                      />
                    )}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-green rounded-full"
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
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-2 w-60 rounded-2xl overflow-hidden z-50"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                          boxShadow: 'var(--shadow-xl)',
                        }}
                      >
                        {link.children.map((child) =>
                          child.external ? (
                            <a
                              key={child.label}
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all duration-150 hover:pl-5"
                              style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-green)')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                            >
                              {child.label}
                              <ExternalLink size={11} className="opacity-40" />
                            </a>
                          ) : (
                            <Link
                              key={child.label}
                              to={child.href}
                              className="flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all duration-150 hover:pl-5"
                              style={{
                                color: child.label.includes('ELPro') ? 'var(--brand-green)' : 'var(--text-secondary)',
                                borderBottom: '1px solid var(--border-subtle)',
                                fontWeight: child.label.includes('ELPro') ? '600' : '500',
                              }}
                              onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-green)')}
                              onMouseLeave={e => (e.currentTarget.style.color = child.label.includes('ELPro') ? 'var(--brand-green)' : 'var(--text-secondary)')}
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
                </div>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <motion.button
                onClick={toggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  background: 'var(--bg-muted)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* ELPro pill */}
              <Link
                to="/elpro"
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold text-brand-green px-3 py-1.5 rounded-full transition-all duration-200 hover:bg-brand-green hover:text-white"
                style={{ border: '1.5px solid var(--brand-green)', background: 'rgba(22,105,53,0.06)' }}
              >
                ELPro
              </Link>

              {/* CTA */}
              <Link to="/get-involved" className="hidden lg:inline-flex btn btn-primary text-sm py-2 px-4">
                Get Involved
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[73px] z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28 }}
              className="fixed right-0 top-[73px] bottom-0 z-50 w-80 overflow-y-auto lg:hidden"
              style={{ background: 'var(--bg-elevated)', borderLeft: '1px solid var(--border-default)' }}
            >
              <div className="px-5 py-6 space-y-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.label}>
                    {link.children ? (
                      <>
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                          className="w-full flex items-center justify-between py-3 text-sm font-semibold transition-colors"
                          style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}
                        >
                          <span className="flex items-center gap-2">
                            {link.label}
                            {link.label === 'Programmes' && (
                              <span className="text-[9px] font-black bg-brand-red text-white px-1.5 py-0.5 rounded-full uppercase">New</span>
                            )}
                          </span>
                          <ChevronDown size={15} className={cn('transition-transform duration-200', mobileExpanded === link.label ? 'rotate-180' : '')} style={{ color: 'var(--text-muted)' }} />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden pl-3"
                            >
                              {link.children.map((child) =>
                                child.external ? (
                                  <a key={child.label} href={child.href} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 py-2.5 text-sm transition-colors"
                                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                                    {child.label} <ExternalLink size={11} className="opacity-50" />
                                  </a>
                                ) : (
                                  <Link key={child.label} to={child.href}
                                    className="flex items-center justify-between py-2.5 text-sm transition-colors"
                                    style={{
                                      color: child.label.includes('ELPro') ? 'var(--brand-green)' : 'var(--text-muted)',
                                      borderBottom: '1px solid var(--border-subtle)',
                                      fontWeight: child.label.includes('ELPro') ? '600' : '400',
                                    }}>
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
                      <Link to={link.href} className="block py-3 text-sm font-semibold transition-colors"
                        style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-5 space-y-3">
                  <Link to="/elpro" className="btn btn-outline-green w-full justify-center text-sm">
                    ELPro — Ethical Leaders Program
                  </Link>
                  <Link to="/get-involved" className="btn btn-primary w-full justify-center text-sm">
                    Get Involved
                  </Link>
                  <button onClick={toggle} className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all"
                    style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                    {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}