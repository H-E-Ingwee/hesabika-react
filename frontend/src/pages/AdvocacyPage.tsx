import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, Scale, Briefcase, BookOpen, HeartHandshake, Wheat, Users, Leaf, HeartPulse, Eye, Megaphone, GraduationCap, Link2 } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CTASection from '@/components/sections/CTASection'
import { ADVOCACY_AREAS, THEOLOGICAL_FRAMEWORK, STRATEGIC_PLAN } from '@/lib/data'

const ADVOCACY_ICONS: Record<string, React.ElementType> = {
  'scale': Scale,
  'briefcase': Briefcase,
  'book-open': BookOpen,
  'heart-handshake': HeartHandshake,
  'wheat': Wheat,
  'users': Users,
  'leaf': Leaf,
  'heart-pulse': HeartPulse,
}

const MANDATE_ICONS: Record<string, React.ElementType> = {
  'eye': Eye,
  'megaphone': Megaphone,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
}

export default function AdvocacyPage() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <>
      <PageHero
        title="Our Advocacy"
        description="Hesabika engages Kenya's most pressing social, governance, economic, and educational challenges from a distinctly biblical and values-driven standpoint — not partisan, but prophetic."
        image="/images/combating.png"
        breadcrumbs={[{ label: 'Advocacy' }]}
      />

      {/* Theological Foundation */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <SectionHeader label="Why We Advocate" title="A Case for Christian Advocacy" labelColor="red" dividerColor="red" />
              <p className="text-gray-500 leading-relaxed mb-5">{THEOLOGICAL_FRAMEWORK.foundation}</p>
              <blockquote className="border-l-4 border-brand-green bg-gray-50 px-5 py-4 rounded-r-xl mb-5 italic text-gray-700 text-sm">
                {THEOLOGICAL_FRAMEWORK.kuyper_quote}
              </blockquote>
              <p className="text-gray-500 leading-relaxed mb-6">{THEOLOGICAL_FRAMEWORK.integral_mission}</p>
              <div className="space-y-2">
                {THEOLOGICAL_FRAMEWORK.principles.map((p, i) => (
                  <div key={i} className="flex gap-2 items-start text-sm text-gray-600">
                    <ArrowRight size={14} className="text-brand-red flex-shrink-0 mt-0.5" />
                    {p}
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <div className="space-y-4">
                {THEOLOGICAL_FRAMEWORK.pillars.map((pillar, i) => (
                  <div key={pillar.title} className={`p-5 rounded-xl border-l-4 ${i % 2 === 0 ? 'border-brand-red bg-brand-red/5' : 'border-brand-green bg-brand-green/5'}`}>
                    <h4 className={`font-bold text-sm mb-1 ${i % 2 === 0 ? 'text-brand-red' : 'text-brand-green'}`}>{pillar.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SP Mandates */}
      <section className="py-20 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3 block">Strategic Plan 2026–2030</span>
            <h2 className="font-serif font-bold text-white text-4xl mb-4">Four Mandates of Societal Transformation</h2>
            <div className="w-14 h-1 bg-brand-red rounded-full mx-auto mb-4" />
            <p className="text-white/55 max-w-2xl mx-auto text-sm leading-relaxed">{STRATEGIC_PLAN.vision}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STRATEGIC_PLAN.mandates.map((mandate, i) => {
              const Icon = MANDATE_ICONS[mandate.icon] || Eye
              return (
                <AnimatedSection key={mandate.title} delay={i * 0.1}>
                  <div className={`rounded-2xl p-6 h-full ${i % 2 === 0 ? 'bg-brand-red' : 'bg-brand-green'} relative overflow-hidden`}>
                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/8" />
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                        <Icon size={18} className="text-white" />
                      </div>
                      <div className="text-white/50 text-xs font-bold mb-1">{mandate.number}</div>
                      <h4 className="font-serif font-bold text-white text-lg mb-3">{mandate.title}</h4>
                      <p className="text-white/75 text-xs leading-relaxed">{mandate.description}</p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>

          {/* SP Deliverables */}
          <div className="mt-10 bg-white/5 border border-white/8 rounded-2xl p-8">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Key SP 2026–2030 Deliverables</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {STRATEGIC_PLAN.deliverables.map((d, i) => (
                <div key={i} className="flex gap-2 items-start text-sm text-white/60">
                  <ArrowRight size={13} className="text-brand-green flex-shrink-0 mt-0.5" />
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8 Advocacy Areas */}
      <section className="py-24 bg-gray-50" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <SectionHeader
              label="Where We Engage"
              title="Eight Critical Advocacy Areas"
              description="These eight areas are not silos — they are interconnected dimensions of a single social reality. Hesabika's work always holds these connections in view."
              center labelColor="red" dividerColor="red"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ADVOCACY_AREAS.map((area, i) => {
              const Icon = ADVOCACY_ICONS[area.icon] || Scale
              return (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${area.color === 'red' ? 'bg-brand-red/10 group-hover:bg-brand-red' : 'bg-brand-green/10 group-hover:bg-brand-green'}`}>
                    <Icon size={18} className={`transition-colors duration-300 ${area.color === 'red' ? 'text-brand-red group-hover:text-white' : 'text-brand-green group-hover:text-white'}`} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-brand-green transition-colors">{area.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed mb-3">{area.description}</p>
                  <div className={`flex items-start gap-1.5 text-xs font-semibold italic ${area.color === 'red' ? 'text-brand-red' : 'text-brand-green'}`}>
                    <BookOpen size={11} className="flex-shrink-0 mt-0.5" />
                    <span>{area.biblical}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Interconnection note */}
          <div className="mt-10 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 min-w-[40px] bg-brand-red/10 rounded-xl flex items-center justify-center">
                <Link2 size={18} className="text-brand-red" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-2">These Issues Are Interconnected</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Corruption undermines education funding. Economic inequality drives mental health crises. Ethnic division poisons governance. Environmental degradation deepens poverty. Hesabika's work must always hold these connections in view, resisting the temptation to engage issues in isolation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <SectionHeader label="Advocacy Partners" title="Who We Work With" center labelColor="green" dividerColor="green" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {STRATEGIC_PLAN.partners.map((partner) => (
              <div key={partner} className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 shadow-sm hover:shadow-md hover:border-brand-green transition-all duration-300">
                <span className="font-semibold text-gray-700 text-sm">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Civic Education 2027 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0d0d0d] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <img src="/images/launch-flyer.png" alt="Civic Education 2027" className="w-full h-64 lg:h-auto object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-1.jpg' }} />
            <div className="p-10 flex flex-col justify-center">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3">2027 Election Engagement</span>
              <h2 className="font-serif font-bold text-white text-3xl mb-4">Civic Education Initiative</h2>
              <p className="text-white/65 leading-relaxed mb-4">
                Hesabika, in partnership with the Katiba Movement, is developing a comprehensive Civic Education curriculum and electoral engagement framework ahead of the 2027 General Elections.
              </p>
              <p className="text-white/65 leading-relaxed mb-6">
                The Governance Caucus is leading this work — equipping Kenyans with the knowledge and tools to participate meaningfully in Kenya's democratic process.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/caucuses#governance" className="btn-primary">
                  Governance Caucus <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-outline-white">Get Involved</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        label="Advocacy"
        title="Speak. Engage. Transform."
        description="Hesabika's advocacy is not partisan — it is prophetic. Join us in speaking truth to power on behalf of the vulnerable, the marginalised, and the common good."
        primaryText="Join a Caucus"
        primaryHref="/caucuses"
        secondaryText="Get Involved"
        secondaryHref="/get-involved"
      />
    </>
  )
}