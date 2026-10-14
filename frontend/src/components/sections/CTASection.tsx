import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Heart } from 'lucide-react'

interface CTASectionProps {
  label?: string
  title?: string
  description?: string
  primaryText?: string
  primaryHref?: string
  secondaryText?: string
  secondaryHref?: string
  bg?: 'green' | 'red' | 'dark' | 'gradient'
}

export default function CTASection({
  label = 'Join the Movement',
  title = 'I Would Like to Partner with Hesabika',
  description = "Help develop the next generation of values-driven leaders for Kenya's governance. Every contribution — of time, talent or treasure — makes a difference.",
  primaryText = 'Get Involved',
  primaryHref = '/get-involved',
  secondaryText = 'Give Now',
  secondaryHref = '/get-involved#give',
  bg = 'green',
}: CTASectionProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const bgStyles = {
    green: { background: 'linear-gradient(135deg, #166935 0%, #0f4d26 100%)' },
    red: { background: 'linear-gradient(135deg, #bd2427 0%, #9a1c1f 100%)' },
    dark: { background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)' },
    gradient: { background: 'linear-gradient(135deg, #166935 0%, #0f4d26 50%, #bd2427 100%)' },
  }[bg]

  return (
    <section className="py-20 relative overflow-hidden" ref={ref} style={bgStyles}>
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, white, transparent)' }} />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-8 pointer-events-none"
        style={{ background: 'radial-gradient(circle, black, transparent)' }} />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: 'rgba(255,255,255,0.55)' }}>
              {label}
            </span>
            <h2 className="font-serif font-bold text-white mb-4 leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              {title}
            </h2>
            <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
              {description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-wrap gap-3 flex-shrink-0"
          >
            <Link
              to={primaryHref}
              className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'
              }}
            >
              <Heart size={15} />
              {primaryText}
            </Link>
            <Link
              to={secondaryHref}
              className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                background: 'rgba(0,0,0,0.2)',
                color: 'rgba(255,255,255,0.8)',
                border: '1.5px solid rgba(255,255,255,0.15)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = '#fff'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'
              }}
            >
              {secondaryText}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}