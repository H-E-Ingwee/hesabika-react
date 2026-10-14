import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { PARTNERS } from '@/lib/data'

export default function PartnersSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  // Duplicate for seamless marquee
  const doubled = [...PARTNERS, ...PARTNERS]

  return (
    <section className="py-16 bg-gray-50 overflow-hidden" id="partners" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-gray-400">
            Our Partners
          </span>
          <h3 className="font-serif font-bold text-2xl text-gray-800 mt-2">
            Organisations We Work With
          </h3>
        </motion.div>

        {/* Marquee */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee gap-12 items-center">
            {doubled.map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="flex-shrink-0 flex items-center justify-center"
              >
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="h-12 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement
                    el.style.display = 'none'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}