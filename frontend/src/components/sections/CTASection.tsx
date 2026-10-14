import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Heart, ArrowRight } from 'lucide-react'

interface CTASectionProps {
  label?: string
  title?: string
  description?: string
  primaryText?: string
  primaryHref?: string
  secondaryText?: string
  secondaryHref?: string
  bg?: 'green' | 'red' | 'dark'
}

export default function CTASection({
  label = 'Join the Movement',
  title = 'I Would Like to Partner with Hesabika',
  description = 'Help develop the next generation of values-driven leaders for Kenya\'s governance. Every contribution — of time, talent or treasure — makes a difference.',
  primaryText = 'Get Involved',
  primaryHref = '/get-involved',
  secondaryText = 'Give Now',
  secondaryHref = '/get-involved#give',
  bg = 'green',
}: CTASectionProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const bgClasses = {
    green: 'bg-brand-green',
    red: 'bg-brand-red',
    dark: 'bg-[#0d0d0d]',
  }

  return (
    <section className={`py-20 relative overflow-hidden ${bgClasses[bg]}`} ref={ref}>
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-black/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-white/60 mb-3 block">
              {label}
            </span>
            <h2 className="font-serif font-bold text-white text-3xl lg:text-4xl mb-4 leading-tight">
              {title}
            </h2>
            <p className="text-white/75 leading-relaxed">{description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-wrap gap-4 flex-shrink-0"
          >
            <Link
              to={primaryHref}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-red text-white font-semibold text-sm rounded-xl border-2 border-brand-red hover:bg-brand-red-dark hover:border-brand-red-dark transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Heart size={16} />
              {primaryText}
            </Link>
            <Link
              to={secondaryHref}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white font-semibold text-sm rounded-xl border-2 border-white/50 hover:bg-white hover:text-brand-green transition-all duration-300 hover:-translate-y-0.5"
            >
              {secondaryText}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}