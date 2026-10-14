import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Eye, Target } from 'lucide-react'

export default function VisionMissionSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section className="py-24 bg-gray-50" id="vision" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="section-label-green">Our Direction</span>
          <h2 className="font-serif font-bold text-4xl lg:text-5xl text-gray-900 mt-1">
            Vision &amp; Mission
          </h2>
          <div className="w-14 h-1 bg-brand-green rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative bg-brand-green rounded-2xl p-10 overflow-hidden group"
          >
            {/* Decorative circle */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/10" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6">
                <Eye size={26} className="text-white" />
              </div>
              <h3 className="font-serif font-bold text-white text-2xl mb-4">
                Our Vision
              </h3>
              <p className="text-white/85 leading-relaxed text-base">
                A Kenya where every citizen is accountable, values-driven, and actively contributing to the transformation of their nation — a Kenya that reflects God's justice, integrity and excellence.
              </p>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative bg-brand-red rounded-2xl p-10 overflow-hidden group"
          >
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-black/10" />

            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mb-6">
                <Target size={26} className="text-white" />
              </div>
              <h3 className="font-serif font-bold text-white text-2xl mb-4">
                Our Mission
              </h3>
              <p className="text-white/85 leading-relaxed text-base">
                To mobilize all Kenyans to stand up and be counted for the transformation of Kenya. We challenge each to take responsibility for their actions and not just point fingers or spectate when things are going wrong.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}