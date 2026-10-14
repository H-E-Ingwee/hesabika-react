import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Eye, Target, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function VisionMissionSection() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <section className="py-24 relative overflow-hidden" id="vision" ref={ref}
      style={{ background: 'var(--bg-subtle)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label-green">Our Direction</span>
          <h2 className="font-serif font-bold text-display-md mb-4" style={{ color: 'var(--text-primary)' }}>
            Vision &amp; Mission
          </h2>
          <div className="divider divider-green divider-center" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative rounded-3xl p-10 overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #166935 0%, #0f4d26 100%)' }}
          >
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/10" />
            <div className="absolute top-0 right-0 w-full h-full bg-noise opacity-20 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/25 transition-colors duration-300">
                <Eye size={26} className="text-white" />
              </div>
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Our Vision</div>
              <h3 className="font-serif font-bold text-white text-2xl mb-4 leading-snug">
                A Transformed Kenya
              </h3>
              <p className="text-white/80 leading-relaxed text-base">
                A Kenya where every citizen is accountable, values-driven, and actively contributing to the transformation of their nation — a Kenya that reflects God's justice, integrity and excellence.
              </p>
              <div className="mt-6 pt-5 border-t border-white/15">
                <Link to="/about" className="inline-flex items-center gap-2 text-white/70 text-sm font-semibold hover:text-white transition-colors group/link">
                  Learn More <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative rounded-3xl p-10 overflow-hidden group"
            style={{ background: 'linear-gradient(135deg, #bd2427 0%, #9a1c1f 100%)' }}
          >
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/10" />
            <div className="absolute top-0 right-0 w-full h-full bg-noise opacity-20 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/25 transition-colors duration-300">
                <Target size={26} className="text-white" />
              </div>
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Our Mission</div>
              <h3 className="font-serif font-bold text-white text-2xl mb-4 leading-snug">
                Mobilize All Kenyans
              </h3>
              <p className="text-white/80 leading-relaxed text-base">
                To mobilize all Kenyans to stand up and be counted for the transformation of Kenya. We challenge each to take responsibility for their actions and not just point fingers or spectate when things are going wrong.
              </p>
              <div className="mt-6 pt-5 border-t border-white/15">
                <Link to="/get-involved" className="inline-flex items-center gap-2 text-white/70 text-sm font-semibold hover:text-white transition-colors group/link">
                  Get Involved <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-sm font-semibold italic" style={{ color: 'var(--text-muted)' }}>
            "Transformation isn't a future event, it's a present-day activity."
          </p>
        </motion.div>
      </div>
    </section>
  )
}