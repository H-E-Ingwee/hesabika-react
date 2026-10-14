import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CTASection from '@/components/sections/CTASection'
import { GIPRO_PROCESS, BLOG_POSTS } from '@/lib/data'
import BlogCard from '@/components/ui/BlogCard'

const eligibility = [
  { title: 'Recent Graduate', desc: 'Must be a recent university graduate or about to graduate, with a passion for public service and governance.' },
  { title: 'Christian Faith', desc: 'Must be a committed Christian who is willing to uphold the Hesabika covenant of integrity, excellence and accountability.' },
  { title: 'Kenyan Citizen', desc: 'Must be a Kenyan citizen with a genuine desire to contribute to the transformation of Kenya\'s governance.' },
  { title: 'Leadership Potential', desc: 'Must demonstrate leadership potential, strong values and a commitment to integrity in public service.' },
  { title: 'Accountability Commitment', desc: 'Must be willing to be held accountable and to hold others accountable throughout the programme.' },
  { title: 'Transformation Mindset', desc: 'Must believe that Kenya can be transformed and be willing to be part of that transformation from within government.' },
]

export default function GiproPage() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <>
      <PageHero
        title="Governance Internship Programme"
        description="Raising values-driven leaders for Kenya's governance — 12 months of intensive training, mentorship and real-world experience."
        image="/images/gipro-group.jpg"
        breadcrumbs={[{ label: 'Initiatives', href: '/initiatives' }, { label: 'GIPro' }]}
      />

      {/* About GIPro */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection direction="left" className="relative">
              <img
                src="/images/gipro-group.jpg"
                alt="GIPro Interns"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-2.jpg' }}
              />
              <div className="absolute -bottom-5 -right-5 w-44 h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl hidden sm:block">
                <img src="/images/jti.jpg" alt="JTI" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/mentorship.jpg' }} />
              </div>
              <div className="absolute -top-4 -left-4 bg-brand-green text-white p-4 rounded-xl shadow-lg text-center hidden sm:block">
                <span className="font-serif font-black text-2xl block">50+</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-85">Interns<br />Placed</span>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <SectionHeader label="About GIPro" title="Raising Values-Driven Leaders for Kenya's Governance" labelColor="green" dividerColor="green" />
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  As Edmund Burke (1729–1797) said, <em>"The only thing necessary for the triumph of evil is for good men to do nothing."</em>
                </p>
                <p>
                  However, 20 young men and women said they will not simply watch their country and future waste away — and they became the first cohort of the Governance Internship Programme (GIPro).
                </p>
                <p>
                  Successful candidates go through 12 months of intensive training, mentorship, coaching and internship in government departments, parliament, counties and constituencies. GIPro is sponsored by Hesabika Trust in partnership with Kenya Government institutions: Kenya School of Government (KSG), The Centre for Parliamentary Studies and Training (CPST), and The Judiciary Training Institute (JTI).
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/gipro/interns" className="btn-secondary"><ArrowRight size={16} /> Meet the Interns</Link>
                <Link to="/gipro/mentors" className="btn-outline-green">Meet the Mentors</Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
            <SectionHeader label="How It Works" title="The GIPro Journey" center labelColor="red" dividerColor="red" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GIPRO_PROCESS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="text-center"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-serif font-black text-2xl text-white mx-auto mb-4 border-4 border-white shadow-lg ${i % 2 === 0 ? 'bg-brand-red' : 'bg-brand-green'}`}>
                  {step.step}
                </div>
                <h5 className="font-bold text-gray-900 text-sm mb-2">{step.title}</h5>
                <p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionHeader label="Who Can Apply" title="Eligibility Criteria" center labelColor="red" dividerColor="red" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {eligibility.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.08}>
                <div className="flex gap-3 items-start bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <CheckCircle size={20} className="text-brand-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h5>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Funding */}
      <section className="py-24 bg-gray-50" id="support">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <AnimatedSection direction="left">
              <SectionHeader label="Support GIPro" title="Help Fund the Next Generation" labelColor="red" dividerColor="red" />
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>The subsidized cost of this programme for each intern is <strong className="text-gray-900">KES 240,000</strong> (KES 20,000 per month). In the current difficult economic climate, this is too much for candidates to raise on their own.</p>
                <p>We know the economic hardship is affecting us all, so we are only requesting you to give <strong className="text-gray-900">KES 1,000 only per month</strong> to support one intern.</p>
                <p>I would like to partner with Hesabika to develop the next generation of values-driven leaders for Kenya's governance.</p>
              </div>
              <Link to="/get-involved#give" className="btn-secondary mt-6 inline-flex">Support an Intern <ArrowRight size={16} /></Link>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <div className="bg-brand-green rounded-2xl p-8 text-white">
                <h3 className="font-serif font-bold text-xl mb-4">How to Give</h3>
                <p className="text-white/75 text-sm mb-6">Support a GIPro intern through any of these channels:</p>
                {[
                  ['MPESA Paybill No.', '769936'],
                  ['Account No.', 'GIPro'],
                  ['Suggested Monthly Gift', 'KES 1,000'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3 mb-2">
                    <span className="text-white/70 text-sm">{label}</span>
                    <strong className="text-white">{value}</strong>
                  </div>
                ))}
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mt-5 mb-3">Bank Transfer</p>
                {[
                  ['Bank', 'Bank of Africa, Kenya'],
                  ['Account Name', 'HESABIKA TRUST'],
                  ['Account No.', '08250710005'],
                  ['SWIFT Code', 'AFRIKENX'],
                  ['P.O. Box', '22770-00505, Nairobi'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3 mb-2">
                    <span className="text-white/70 text-sm">{label}</span>
                    <strong className="text-white text-sm">{value}</strong>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* GIPro Stories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader label="GIPro Stories" title="Voices from the Field" center labelColor="red" dividerColor="red" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.1}>
                <BlogCard {...post} />
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gipro/interns" className="btn-outline-red">Meet All GIPro Interns <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <CTASection
        label="Apply Now"
        title="Ready to Join GIPro?"
        description="Applications open periodically. Register your interest and we'll notify you when the next cohort opens."
        primaryText="Apply as Intern"
        primaryHref="/get-involved#intern"
        secondaryText="Become a Mentor"
        secondaryHref="/get-involved#mentor"
      />
    </>
  )
}