import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { VALUES } from '@/lib/data'
import SectionHeader from '../ui/SectionHeader'

export default function ValuesSection() {
  const [flipped, setFlipped] = useState<number | null>(null)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section className="py-24 bg-[#0d0d0d]" id="values" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionHeader
            label="Our Core Values"
            title="The Hesabika Covenant"
            description="Six pillars that guide every action, every decision, and every leader we raise. Click a card to read the full covenant."
            center
            light
            labelColor="white"
            dividerColor="red"
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative"
              style={{ perspective: '1000px' }}
            >
              <div
                className="relative cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: flipped === i ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  minHeight: '220px',
                }}
                onClick={() => setFlipped(flipped === i ? null : i)}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 bg-[#1a1a1a] p-7 flex flex-col group hover:bg-[#1e1e1e] transition-colors duration-200"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-brand-red transition-colors duration-300">
                    {value.icon}
                  </div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">
                    {value.title}
                  </h4>
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-3">
                    {value.covenant.slice(0, 100)}...
                  </p>
                  <div className="mt-auto pt-3">
                    <span className="text-brand-red text-xs font-semibold">
                      Tap to read covenant →
                    </span>
                  </div>
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 bg-brand-red p-7 flex flex-col"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="text-white/80 text-xs font-bold uppercase tracking-widest mb-3">
                    {value.title} Covenant
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed flex-1">
                    {value.covenant}
                  </p>
                  <button className="mt-3 text-white/60 text-xs font-semibold hover:text-white transition-colors">
                    ← Tap to close
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}