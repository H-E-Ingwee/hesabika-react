import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Landmark, Banknote, BookOpen, Cross, Building2 } from 'lucide-react'
import { CAUCUSES } from '@/lib/data'
import SectionHeader from '../ui/SectionHeader'

const CAUCUS_ICONS: Record<string, React.ElementType> = {
  'landmark': Landmark,
  'banknote': Banknote,
  'book': BookOpen,
  'cross': Cross,
  'building2': Building2,
}

export default function CaucusesPreview() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section className="py-24 bg-gray-50" id="caucuses" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              label="Thematic Working Groups"
              title="Our Five Caucuses"
              description="Five expert-led caucuses driving Hesabika's advocacy across Kenya's most pressing challenges."
              labelColor="green"
              dividerColor="green"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/caucuses" className="btn-outline-green text-sm py-2.5 px-5 flex-shrink-0">
              All Caucuses <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>

        {/* Caucus cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CAUCUSES.map((caucus, i) => {
            const Icon = CAUCUS_ICONS[caucus.icon] || Landmark
            return (
              <motion.div
                key={caucus.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group"
              >
                <Link to={`/caucuses#${caucus.id}`} className="block h-full">
                  <div className={`rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${caucus.color === 'green' ? 'bg-brand-green hover:bg-brand-green-dark' : 'bg-brand-red hover:bg-brand-red-dark'} relative overflow-hidden`}>
                    <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-white/10" />
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        <Icon size={20} className="text-white" />
                      </div>
                      <h4 className="font-serif font-bold text-white text-sm leading-snug mb-2">{caucus.title}</h4>
                      <p className="text-white/65 text-xs leading-relaxed mb-3 line-clamp-3">{caucus.description}</p>
                      <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">
                        {caucus.convenor}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-white border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
        >
          <div>
            <p className="font-semibold text-gray-900 text-sm mb-1">Are you an expert in any of these areas?</p>
            <p className="text-gray-500 text-xs">Hesabika's caucuses welcome engaged Kenyans who want to translate their concern into action.</p>
          </div>
          <Link to="/contact" className="btn-secondary text-sm py-2.5 px-5 flex-shrink-0">
            Join a Caucus <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}