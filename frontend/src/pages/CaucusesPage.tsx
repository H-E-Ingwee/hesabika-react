import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight, Landmark, Banknote, BookOpen, Cross, Building2, Eye, Megaphone, GraduationCap, HeartHandshake } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CTASection from '@/components/sections/CTASection'
import { CAUCUSES, STRATEGIC_PLAN } from '@/lib/data'

const CAUCUS_ICONS: Record<string, React.ElementType> = {
  'landmark': Landmark,
  'banknote': Banknote,
  'book': BookOpen,
  'cross': Cross,
  'hospital': Building2,
}

const MANDATE_ICONS: Record<string, React.ElementType> = {
  'eye': Eye,
  'megaphone': Megaphone,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
}

function CaucusCard({ caucus, index }: { caucus: typeof CAUCUSES[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const Icon = CAUCUS_ICONS[caucus.icon] || Landmark

  const colorClasses = {
    green: { bg: 'bg-brand-green', light: 'bg-brand-green/8', text: 'text-brand-green', border: 'border-brand-green' },
    red: { bg: 'bg-brand-red', light: 'bg-brand-red/8', text: 'text-brand-red', border: 'border-brand-red' },
  }
  const c = colorClasses[caucus.color as 'green' | 'red']

  return (
    <motion.div
      ref={ref}
      id={caucus.id}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden scroll-mt-24"
    >
      {/* Header */}
      <div className={`${c.bg} p-6 relative overflow-hidden`}>
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <Icon size={20} className="text-white" />
            </div>
            <h3 className="font-serif font-bold text-white text-xl mb-1">{caucus.title}</h3>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">
              Convenor: {caucus.convenor}
            </p>
          </div>
          <span className="text-white/20 font-serif font-black text-5xl leading-none">
            0{index + 1}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{caucus.description}</p>

        {/* Recent work */}
        <div className={`${c.light} border ${c.border} border-opacity-20 rounded-xl p-4 mb-4`}>
          <p className={`${c.text} text-xs font-bold uppercase tracking-wider mb-1`}>Recent Work</p>
          <p className="text-gray-600 text-sm">{caucus.recent_work}</p>
        </div>

        {/* Focus areas accordion */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors py-2"
        >
          <span>Focus Areas ({caucus.focus_areas.length})</span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <ul className="space-y-2 pt-2">
                {caucus.focus_areas.map((area, i) => (
                  <li key={i} className="flex gap-2 items-start text-sm text-gray-500">
                    <ArrowRight size={13} className={`${c.text} mt-0.5 flex-shrink-0`} />
                    {area}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function CaucusesPage() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <>
      <PageHero
        title="Hesabika Caucuses"
        description="Five thematic working groups — each chaired by an expert volunteer convenor — driving Hesabika's awareness, advocacy, and capacity-building work across Kenya."
        image="/images/bimonthly.jpg"
        breadcrumbs={[{ label: 'Caucuses' }]}
      />

      {/* What is the Caucus Model */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <SectionHeader label="The Caucus Model" title="Distributed Leadership for Maximum Impact" labelColor="red" dividerColor="red" />
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  The caucus model is one of Hesabika's most important structural innovations. Recognising that the Secretariat cannot do everything on its own, Hesabika has established five thematic caucus groups, each chaired by a volunteer champion who is an expert or deeply engaged practitioner in their field.
                </p>
                <p>
                  This distributed leadership model allows Hesabika to engage multiple complex issues simultaneously, while maintaining a coherent overall vision. Each caucus operates with a degree of autonomy, setting its own agenda and pace of engagement, while remaining accountable to the Steering Committee.
                </p>
                <blockquote className="border-l-4 border-brand-green bg-gray-50 px-5 py-4 rounded-r-xl italic text-gray-700 text-sm">
                  "There is no square inch of creation over which Christ does not say 'Mine.'" — Abraham Kuyper
                </blockquote>
                <p>
                  The caucuses are the primary delivery mechanism for Hesabika's four mandates under the Strategic Plan 2026–2030: Awareness, Advocacy, Capacity Building, and Partnerships.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <div className="bg-[#0d0d0d] rounded-2xl p-8">
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-5">SP 2026–2030 Mandates</p>
                <div className="space-y-4">
                  {STRATEGIC_PLAN.mandates.map((m, i) => {
                    const Icon = MANDATE_ICONS[m.icon] || Eye
                    return (
                      <div key={m.title} className="flex gap-4 items-start">
                        <div className={`w-10 h-10 min-w-[40px] rounded-xl flex items-center justify-center ${i % 2 === 0 ? 'bg-brand-red/15' : 'bg-brand-green/15'}`}>
                          <Icon size={18} className={i % 2 === 0 ? 'text-brand-red' : 'text-brand-green'} />
                        </div>
                        <div>
                          <h5 className="text-white font-bold text-sm mb-0.5">{m.number} — {m.title}</h5>
                          <p className="text-white/50 text-xs leading-relaxed line-clamp-2">{m.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Caucuses Grid */}
      <section className="py-24 bg-gray-50" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <SectionHeader
              label="Our Five Caucuses"
              title="Thematic Working Groups"
              description="Each caucus is led by an expert volunteer convenor and engages Kenya's most pressing challenges from a biblical and values-driven standpoint."
              center labelColor="red" dividerColor="red"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAUCUSES.map((caucus, i) => (
              <CaucusCard key={caucus.id} caucus={caucus} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Steering Committee */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0d0d0d] rounded-2xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3 block">Governance</span>
              <h2 className="font-serif font-bold text-white text-3xl mb-4">Steering Committee</h2>
              <div className="w-12 h-1 bg-brand-red rounded-full mb-5" />
              <p className="text-white/65 leading-relaxed mb-4">
                The Steering Committee is the strategic oversight body of Hesabika, chaired by <strong className="text-white">Mr. Kimathi Kamencu</strong>. It meets periodically to review progress, make strategic decisions, and provide accountability across all caucuses and programmes.
              </p>
              <p className="text-white/65 leading-relaxed">
                The Secretariat, led by <strong className="text-white">Sharon Christine</strong> (Societal Transformation & Hesabika Coordinator), coordinates all caucus activities, manages communications, and supports programme delivery.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { role: 'Chair, Steering Committee', name: 'Kimathi Kamencu' },
                { role: 'Societal Transformation & Hesabika Coordinator', name: 'Sharon Christine' },
                { role: 'STEM Staff, Hesabika | FOCUS Kenya', name: 'Brian Ingwee' },
                { role: 'Chair, Marketplace Committee', name: 'Dr. Nelson Gitonga' },
                { role: 'Katiba Movement Representative', name: 'Micheal Mutinda' },
              ].map((person) => (
                <div key={person.name} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center font-serif font-bold text-brand-green text-sm flex-shrink-0">
                    {person.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{person.name}</p>
                    <p className="text-white/45 text-xs">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            label="Get Involved"
            title="Join a Caucus"
            description="Are you an expert or practitioner passionate about one of these areas? Hesabika's caucuses welcome engaged Kenyans who want to translate their concern into action."
            center labelColor="green" dividerColor="green"
          />
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-secondary">
              Express Interest <ArrowRight size={16} />
            </Link>
            <Link to="/advocacy" className="btn-outline-red">
              View Advocacy Areas
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        label="Translate Concern into Action"
        title="Stand Up and Be Counted"
        description="The caucuses are where concern becomes action. Join Hesabika's growing community of Kenyans committed to transformation."
        primaryText="Get Involved"
        primaryHref="/get-involved"
        secondaryText="Contact Us"
        secondaryHref="/contact"
      />
    </>
  )
}