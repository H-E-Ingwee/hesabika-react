import { STATS } from '@/lib/data'
import StatCounter from '../ui/StatCounter'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section className="relative overflow-hidden" ref={ref} style={{ background: '#0a0a0a' }}>
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-red/5 via-transparent to-brand-green/5 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-red/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-green/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative py-10 px-6 text-center group"
            >
              {/* Vertical divider */}
              {i < STATS.length - 1 && (
                <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />
              )}
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: i % 2 === 0 ? 'radial-gradient(ellipse at center, rgba(189,36,39,0.06) 0%, transparent 70%)' : 'radial-gradient(ellipse at center, rgba(22,105,53,0.06) 0%, transparent 70%)' }} />
              <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}