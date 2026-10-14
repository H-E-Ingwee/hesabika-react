import { useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import CTASection from '@/components/sections/CTASection'
import { GIPRO_INTERNS } from '@/lib/data'

const cohorts = ['All', '2021', '2022', '2023']

interface InternModalProps {
  intern: typeof GIPRO_INTERNS[0]
  onClose: () => void
}

function InternModal({ intern, onClose }: InternModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={intern.image}
            alt={intern.name}
            className="w-full h-64 object-cover object-top"
            onError={(e) => {
              const el = e.target as HTMLImageElement
              el.src = '/images/board-Hesabika-Noimg.jpg'
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red to-brand-green" />
        </div>
        <div className="p-6">
          <h3 className="font-serif font-bold text-xl text-gray-900 mb-1">{intern.name}</h3>
          <p className="text-brand-green text-xs font-bold uppercase tracking-wider mb-2">
            GIPro {intern.cohort} Cohort
          </p>
          <p className="text-gray-500 text-sm">{intern.placement}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function InternsPage() {
  const [activeCohort, setActiveCohort] = useState('All')
  const [selectedIntern, setSelectedIntern] = useState<typeof GIPRO_INTERNS[0] | null>(null)
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  const filtered =
    activeCohort === 'All'
      ? GIPRO_INTERNS
      : GIPRO_INTERNS.filter((i) => i.cohort === activeCohort)

  const cohortCounts = cohorts.reduce((acc, c) => {
    acc[c] = c === 'All' ? GIPRO_INTERNS.length : GIPRO_INTERNS.filter((i) => i.cohort === c).length
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      <PageHero
        title="GIPro Interns"
        description="Meet the young values-driven leaders serving in Kenya's governance institutions through the Governance Internship Programme."
        image="/images/gipro-group.jpg"
        breadcrumbs={[{ label: 'GIPro', href: '/gipro' }, { label: 'GIPro Interns' }]}
      />

      <section className="py-24 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader
                label="Our Interns"
                title="GIPro Cohorts"
                labelColor="green"
                dividerColor="green"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 rounded-xl px-5 py-3 text-center"
            >
              <div className="font-serif font-black text-3xl text-brand-green">50+</div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Interns</div>
            </motion.div>
          </div>

          {/* Filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {cohorts.map((cohort) => (
              <button
                key={cohort}
                onClick={() => setActiveCohort(cohort)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                  activeCohort === cohort
                    ? 'bg-brand-green border-brand-green text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-brand-green hover:text-brand-green'
                }`}
              >
                {cohort === 'All' ? 'All Cohorts' : `${cohort} Cohort`}
                <span className="ml-1.5 text-xs opacity-70">({cohortCounts[cohort]})</span>
              </button>
            ))}
          </motion.div>

          {/* Interns grid */}
          <LayoutGroup>
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((intern, i) => (
                  <motion.div
                    key={intern.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedIntern(intern)}
                  >
                    <div className="relative rounded-xl overflow-hidden aspect-square mb-2 border-2 border-transparent group-hover:border-brand-green transition-all duration-300 shadow-sm group-hover:shadow-md">
                      <img
                        src={intern.image}
                        alt={intern.name}
                        className="w-full h-full object-cover object-top transition-transform duration-400 group-hover:scale-105"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement
                          el.src = '/images/board-Hesabika-Noimg.jpg'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <div>
                          <p className="text-white text-xs font-bold leading-tight">{intern.name}</p>
                          <p className="text-white/70 text-[10px]">{intern.cohort} Cohort</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-800 text-xs font-semibold text-center leading-tight">{intern.name}</p>
                    <p className="text-brand-green text-[10px] font-bold uppercase tracking-wider text-center">{intern.cohort}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </section>

      {/* Intern Modal */}
      <AnimatePresence>
        {selectedIntern && (
          <InternModal intern={selectedIntern} onClose={() => setSelectedIntern(null)} />
        )}
      </AnimatePresence>

      <CTASection
        label="Join GIPro"
        title="Want to Be Part of the Next Cohort?"
        description="Applications open periodically. Register your interest and we'll notify you when the next cohort opens."
        primaryText="Apply as Intern"
        primaryHref="/get-involved#intern"
        secondaryText="Support an Intern"
        secondaryHref="/get-involved#give"
      />
    </>
  )
}