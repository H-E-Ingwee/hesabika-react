import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Breadcrumb {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  description?: string
  image?: string
  breadcrumbs?: Breadcrumb[]
  className?: string
  overlay?: string
  children?: React.ReactNode
}

export default function PageHero({
  title,
  description,
  image = '/images/hero-1.jpg',
  breadcrumbs = [],
  className,
  overlay,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn('relative min-h-[380px] flex items-center', className)}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div
        className={cn(
          'absolute inset-0',
          overlay ||
            'bg-gradient-to-r from-black/85 via-black/60 to-brand-green/30'
        )}
      />

      {/* Red accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-brand-green to-brand-red opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 mb-5 text-xs text-white/50"
          >
            <Link to="/" className="hover:text-white/80 transition-colors">
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight size={12} className="opacity-40" />
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-white/80 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white/70">{crumb.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif font-bold text-white text-4xl sm:text-5xl lg:text-6xl max-w-3xl leading-tight"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-white/75 text-lg max-w-2xl leading-relaxed"
          >
            {description}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  )
}