import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/data'
import SectionHeader from '../ui/SectionHeader'

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((c) => (c + 1) % TESTIMONIALS.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next])

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  }

  const t = TESTIMONIALS[current]

  return (
    <section className="py-24 bg-gray-50" id="testimonials" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionHeader
            label="GIPro Stories"
            title="Voices from the Field"
            center
            labelColor="red"
            dividerColor="red"
          />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Main testimonial */}
          <div className="relative bg-white rounded-3xl shadow-xl p-10 lg:p-14 overflow-hidden">
            {/* Big quote mark */}
            <Quote
              size={80}
              className="absolute top-6 left-8 text-brand-red/8 fill-brand-red/8"
            />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <p className="text-gray-700 text-lg lg:text-xl leading-relaxed italic mb-8 font-serif">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-green/30 flex-shrink-0">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        const el = e.target as HTMLImageElement
                        el.style.display = 'none'
                        el.parentElement!.innerHTML = `<div class="w-full h-full bg-brand-green/20 flex items-center justify-center font-serif font-bold text-brand-green text-lg">${t.name[0]}</div>`
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-brand-green text-xs font-bold uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Red accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red to-brand-green" />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-8 h-2.5 bg-brand-red'
                      : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red transition-all duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red transition-all duration-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}