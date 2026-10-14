import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink } from 'lucide-react'

export default function FocusKenyaBanner() {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <section className="bg-brand-green py-5" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-black">FK</span>
            </div>
            <p className="text-white text-sm font-medium">
              <span className="font-bold">Hesabika</span>
              <span className="text-white/70 mx-2">·</span>
              <span className="text-white/85">FOCUS Kenya's Societal Transformation Arm</span>
              <span className="text-white/70 mx-2">·</span>
              <span className="text-white/70 text-xs">Strategic Plan 2026–2030</span>
            </p>
          </div>
          <a
            href="https://www.focuskenya.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/70 text-xs font-semibold hover:text-white transition-colors flex-shrink-0"
          >
            Visit FOCUS Kenya <ExternalLink size={11} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}