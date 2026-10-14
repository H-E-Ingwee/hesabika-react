import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Scale, Wrench, Building2, Landmark, Banknote, GraduationCap, ClipboardList, Megaphone } from 'lucide-react'

const FIELD_ICONS: Record<string, React.ElementType> = {
  'scale': Scale, 'wrench': Wrench, 'hospital': Building2, 'landmark': Landmark,
  'banknote': Banknote, 'graduation-cap': GraduationCap, 'clipboard': ClipboardList, 'megaphone': Megaphone,
}
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import StatCounter from '@/components/ui/StatCounter'
import CTASection from '@/components/sections/CTASection'
import { SECRETARIAT } from '@/lib/data'

const mentorQualities = [
  'Minimum 5 years professional experience in their field',
  'Committed Christian with strong personal values and integrity',
  'Passionate about Kenya\'s governance and transformation',
  'Willing to commit 2–4 hours per month to mentorship',
  'Willing to model integrity, excellence and accountability',
]

const mentorFields = [
  { field: 'Law / Legal', icon: 'scale' },
  { field: 'Engineering', icon: 'wrench' },
  { field: 'Medicine / Health', icon: 'hospital' },
  { field: 'Public Administration', icon: 'landmark' },
  { field: 'Finance', icon: 'banknote' },
  { field: 'Academia', icon: 'graduation-cap' },
  { field: 'Public Policy', icon: 'clipboard' },
  { field: 'Communications', icon: 'megaphone' },
]

export default function MentorsPage() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <>
      <PageHero
        title="GIPro Mentors"
        description="40+ experienced professionals investing in the next generation of Kenya's governance leaders."
        image="/images/mentorship-2.jpg"
        breadcrumbs={[{ label: 'GIPro', href: '/gipro' }, { label: 'GIPro Mentors' }]}
      />

      {/* Intro */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection direction="left">
              <img
                src="/images/mentorship.jpg"
                alt="GIPro Mentorship"
                className="w-full h-[460px] object-cover rounded-2xl shadow-2xl"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-2.jpg' }}
              />
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <SectionHeader
                label="About Mentorship"
                title="Experienced Leaders Investing in Kenya's Future"
                labelColor="green"
                dividerColor="green"
              />
              <div className="space-y-4 text-gray-500 leading-relaxed mb-6">
                <p>
                  GIPro mentors are experienced professionals from across Kenya's public and private sectors who are passionate about Kenya's transformation and willing to invest their time, wisdom and networks in the next generation of leaders.
                </p>
                <p>
                  Each mentor is paired with a GIPro intern for 12 months, meeting regularly to provide guidance, accountability and practical wisdom as the intern navigates their governance internship.
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {mentorQualities.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex gap-3 items-start"
                  >
                    <CheckCircle size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                    <p className="text-gray-600 text-sm">{q}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/get-involved#mentor" className="btn-secondary">
                  <ArrowRight size={16} /> Become a Mentor
                </Link>
                <Link to="/gipro" className="btn-outline-green">
                  Learn About GIPro
                </Link>
              </div>
            </AnimatedSection>
          </div>

          {/* Stats */}
          <div ref={ref} className="mt-16 bg-[#0d0d0d] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3">
              {[
                { value: 40, suffix: '+', label: 'Active Mentors' },
                { value: 12, suffix: '', label: 'Months per Cohort' },
                { value: 50, suffix: '+', label: 'Interns Mentored' },
              ].map((stat, i) => (
                <div key={stat.label} className="py-10 px-6 border-r border-white/6 last:border-r-0">
                  <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mentor Fields */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionHeader
              label="Professional Diversity"
              title="Mentors Across All Fields"
              description="Our mentors come from diverse professional backgrounds, united by a shared commitment to Kenya's transformation."
              center
              labelColor="red"
              dividerColor="red"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
            {mentorFields.map((item, i) => {
              const Icon = FIELD_ICONS[item.icon] || Scale
              return (
                <AnimatedSection key={item.field} delay={i * 0.06}>
                  <div className="bg-white rounded-xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon size={18} className="text-brand-green" />
                    </div>
                    <p className="text-gray-700 text-sm font-semibold">{item.field}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>

          {/* Secretariat as mentor representatives */}
          <div className="text-center mb-10">
            <SectionHeader
              label="Meet Some Mentors"
              title="GIPro Mentor Profiles"
              center
              labelColor="green"
              dividerColor="green"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {SECRETARIAT.slice(0, 8).map((member, i) => (
              <AnimatedSection key={member.id} delay={i * 0.07}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/board-Hesabika-Noimg.jpg' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-green/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-bold text-gray-900 text-sm mb-1">{member.name}</p>
                    <p className="text-brand-green text-xs font-bold uppercase tracking-wider">GIPro Mentor</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center mt-10 p-8 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-sm mb-4">
              We have <strong className="text-gray-900">40+ mentors</strong> across diverse professional fields. Are you an experienced professional passionate about Kenya's transformation?
            </p>
            <Link to="/get-involved#mentor" className="btn-secondary">
              Become a Mentor <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        label="Join Us"
        title="Invest in Kenya's Next Generation"
        description="Your experience, wisdom and networks can shape the future of Kenya's governance. Become a GIPro mentor today."
        primaryText="Apply as Mentor"
        primaryHref="/get-involved#mentor"
        secondaryText="Learn About GIPro"
        secondaryHref="/gipro"
      />
    </>
  )
}