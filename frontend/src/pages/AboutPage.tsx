import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ValuesSection from '@/components/sections/ValuesSection'
import VisionMissionSection from '@/components/sections/VisionMissionSection'
import PartnersSection from '@/components/sections/PartnersSection'
import CTASection from '@/components/sections/CTASection'
import { TIMELINE, PARTNERS } from '@/lib/data'

export default function AboutPage() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <>
      <PageHero
        title="About Hesabika Trust"
        description="A catalyst for value-driven socio-economic transformation of Kenya — translating concern into action since 2016."
        image="/images/hero-1.jpg"
        breadcrumbs={[{ label: 'About Us' }]}
      />

      {/* Who We Are */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection direction="left" className="relative">
              <img
                src="/images/about.jpg"
                alt="Hesabika Team"
                className="w-full h-[520px] object-cover rounded-2xl shadow-2xl"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-2.jpg' }}
              />
              <div className="absolute -bottom-5 -right-5 w-44 h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl hidden sm:block">
                <img src="/images/group-1.jpg" alt="Group" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-3.jpg' }} />
              </div>
              <div className="absolute -top-4 -left-4 bg-brand-red text-white p-4 rounded-xl shadow-lg text-center hidden sm:block">
                <span className="font-serif font-black text-2xl block">2016</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-85">Founded</span>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <SectionHeader
                label="Who We Are"
                title="The Hesabika Call for Everyone"
                labelColor="red"
                dividerColor="red"
              />
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  HESABIKA is a catalyst for a value-driven socio-economic transformation of Kenya. It is a call, first to Christian professionals, students and the church at large to be salt and light in the world.
                </p>
                <p>
                  The Hesabika call is for everyone: A Call to stand up and be counted. A call to translate concern into action. A call to be an agent of transformation in your sphere of influence — in your family, workplace, community and nation.
                </p>
                <blockquote className="border-l-4 border-brand-green bg-gray-50 px-5 py-4 rounded-r-xl italic text-gray-700 text-sm">
                  "Transformation isn't a future event, it's a present-day activity."
                </blockquote>
                <p>
                  HESABIKA was started as an initiative of Fellowship of Christian Unions (FOCUS) Kenya and was launched at the first HESABIKA National Convention in April 2016. HESABIKA is registered as a Trust and has nine Trustees.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/about/board" className="btn-secondary">
                  <ArrowRight size={16} /> Board of Trustees
                </Link>
                <Link to="/about/secretariat" className="btn-outline-red">
                  Secretariat
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <VisionMissionSection />

      {/* History / Timeline */}
      <section className="py-24 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection direction="right" className="order-2 lg:order-1">
              <SectionHeader
                label="Our Story"
                title="How It All Started"
                labelColor="red"
                dividerColor="red"
              />
              <p className="text-gray-500 leading-relaxed mb-8">
                HESABIKA was started as an initiative of Fellowship of Christian Unions (FOCUS) Kenya and was launched at the first HESABIKA National Convention in April 2016. It operates as a non-partisan, faith-based civic movement calling Kenyans to translate their concern into action.
              </p>

              {/* Timeline */}
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-red to-brand-green" />
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative mb-7 last:mb-0"
                  >
                    <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-brand-red border-2 border-white shadow-sm" />
                    <div className="text-xs font-bold text-brand-red uppercase tracking-wider mb-1">
                      {item.year}
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="left" className="order-1 lg:order-2">
              <img
                src="/images/hero-2.jpg"
                alt="Hesabika History"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <ValuesSection />

      {/* Partners */}
      <PartnersSection />

      {/* CTA */}
      <CTASection
        title="Be an Agent of Transformation"
        description="The Hesabika call is for everyone. Stand up and be counted for the transformation of Kenya."
        primaryText="Get Involved"
        primaryHref="/get-involved"
        secondaryText="Contact Us"
        secondaryHref="/contact"
      />
    </>
  )
}