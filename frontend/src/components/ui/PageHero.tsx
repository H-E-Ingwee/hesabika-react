import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  description?: string
  image?: string
  breadcrumbs?: Breadcrumb[]
  overlay?: string
  children?: React.ReactNode
}

export default function PageHero({
  title,
  description,
  image = '/images/hero-1.jpg',
  breadcrumbs = [],
  overlay,
  children,
}: PageHeroProps) {
  return (
    <section
      className="relative min-h-[400px] flex items-end overflow-hidden"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Layered overlays */}
      <div className="absolute inset-0" style={{
        background: overlay || 'linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.65) 60%, rgba(10,10,10,0.3) 100%)'
      }} />
      <div className="absolute inset-0 bg-noise opacity-25" />

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-red via-brand-green to-brand-red opacity-70" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 mb-5 text-xs"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-white/80 transition-colors">{crumb.label}</Link>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{crumb.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-bold text-white max-w-3xl leading-tight mb-4"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg max-w-2xl leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            {description}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}