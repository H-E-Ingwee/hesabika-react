import { useState, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, X, Search } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import CTASection from '@/components/sections/CTASection'
import { fetchGiproInterns } from '@/lib/api'

const cohorts = ['All', '2021', '2022', '2023']

function InternModal({ intern, onClose }: { intern: any; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="rounded-2xl overflow-hidden max-w-sm w-full"
        style={{ background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-xl)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <img src={intern.image_url || intern.image} alt={intern.name}
            className="w-full h-64 object-cover object-top"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/board-Hesabika-Noimg.jpg' }} />
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
            <X size={16} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red to-brand-green" />
        </div>
        <div className="p-6">
          <h3 className="font-serif font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>{intern.name}</h3>
          <p className="text-brand-green text-xs font-bold uppercase tracking-wider mb-2">
            GIPro {intern.cohort} Cohort
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{intern.placement}</p>
          {intern.bio && <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{intern.bio}</p>}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function InternsPage() {
  const [activeCohort, setActiveCohort] = useState('All')
  const [selectedIntern, setSelectedIntern] = useState<any>(null)
  const [interns, setInterns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  useEffect(() => {
    fetchGiproInterns().then(data => { setInterns(data); setLoading(false) })
  }, [])

  const filtered = interns.filter(i => {
    const matchCohort = activeCohort === 'All' || i.cohort === activeCohort
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase())
    return matchCohort && matchSearch
  })

  const cohortCounts = cohorts.reduce((acc, c) => {
    acc[c] = c === 'All' ? interns.length : interns.filter(i => i.cohort === c).length
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      <PageHero
        title="GIPro Interns"
        description="Meet the young values-driven leaders who served in Kenya's governance institutions through the Governance Internship Programme."
        image="/images/gipro-group.jpg"
        breadcrumbs={[{ label: 'GIPro', href: '/gipro' }, { label: 'GIPro Interns' }]}
      />

      <section className="py-24" ref={ref} style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <SectionHeader label="Our Interns" title="GIPro Cohorts" labelColor="green" dividerColor="green" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-xl px-5 py-3 text-center" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div className="font-serif font-black text-3xl text-brand-green">{interns.length}+</div>
              <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Total Alumni</div>
            </motion.div>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search interns…" className="form-input pl-9" />
            </div>
            <div className="flex flex-wrap gap-2">
              {cohorts.map(cohort => (
                <button key={cohort} onClick={() => setActiveCohort(cohort)}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    background: activeCohort === cohort ? 'var(--brand-green)' : 'var(--bg-muted)',
                    color: activeCohort === cohort ? '#fff' : 'var(--text-muted)',
                    border: `2px solid ${activeCohort === cohort ? 'var(--brand-green)' : 'var(--border-subtle)'}`,
                  }}>
                  {cohort === 'All' ? 'All Cohorts' : `${cohort} Cohort`}
                  <span className="ml-1.5 text-xs opacity-70">({cohortCounts[cohort]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden">
                  <div className="aspect-square skeleton" />
                  <div className="p-2 space-y-1">
                    <div className="h-3 skeleton rounded w-3/4" />
                    <div className="h-2 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <LayoutGroup>
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((intern, i) => (
                    <motion.div
                      key={intern.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.02 }}
                      className="group cursor-pointer"
                      onClick={() => setSelectedIntern(intern)}
                    >
                      <div className="relative rounded-xl overflow-hidden aspect-square mb-2 transition-all duration-300"
                        style={{ border: '2px solid var(--border-subtle)' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--brand-green)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}>
                        <img src={intern.image_url || intern.image} alt={intern.name}
                          className="w-full h-full object-cover object-top transition-transform duration-400 group-hover:scale-105"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/board-Hesabika-Noimg.jpg' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                          <div>
                            <p className="text-white text-xs font-bold leading-tight">{intern.name}</p>
                            <p className="text-white/70 text-[10px]">{intern.cohort} Cohort</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-center leading-tight" style={{ color: 'var(--text-primary)' }}>{intern.name}</p>
                      <p className="text-brand-green text-[10px] font-bold uppercase tracking-wider text-center">{intern.cohort}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <p style={{ color: 'var(--text-muted)' }}>No interns found</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedIntern && <InternModal intern={selectedIntern} onClose={() => setSelectedIntern(null)} />}
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