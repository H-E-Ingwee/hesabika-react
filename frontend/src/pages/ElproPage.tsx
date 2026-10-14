import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Users, Star, Shield, Heart } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import StatCounter from '@/components/ui/StatCounter'
import CTASection from '@/components/sections/CTASection'
import BlogCard from '@/components/ui/BlogCard'
import { ELPRO, BLOG_POSTS } from '@/lib/data'

export default function ElproPage() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <>
      <PageHero
        title="Ethical Leaders Program"
        description="ELPro — Building a critical mass of ethical champions within government, strengthening integrity in public service, and fostering intergenerational transfer of values."
        image="/images/gipro-group.jpg"
        breadcrumbs={[{ label: 'Programmes', href: '/initiatives' }, { label: 'ELPro' }]}
      >
        <div className="flex flex-wrap gap-2 mt-4">
          {ELPRO.hashtags.map(tag => (
            <span key={tag} className="text-xs font-bold text-white/60 bg-white/10 px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      </PageHero>

      {/* Launch Banner */}
      <div className="bg-brand-red py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0" />
              <p className="text-white text-sm font-semibold">
                🎉 ELPro Inaugural Cohort — Launched April 11, 2026 · 23 Fellows Enrolled
              </p>
            </div>
            <span className="text-white/70 text-xs font-medium">April 2026 – April 2027</span>
          </div>
        </div>
      </div>

      {/* About ELPro */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <AnimatedSection direction="left" className="relative">
              <img
                src="/images/gipro-group.jpg"
                alt="ELPro Fellows"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-2.jpg' }}
              />
              <div className="absolute -bottom-5 -right-5 w-44 h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl hidden sm:block">
                <img src="/images/mentorship.jpg" alt="Mentorship" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-3.jpg' }} />
              </div>
              <div className="absolute -top-4 -left-4 bg-brand-green text-white p-4 rounded-xl shadow-lg text-center hidden sm:block">
                <span className="font-serif font-black text-2xl block">23</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-85">Fellows<br />Enrolled</span>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" delay={0.1}>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-brand-red mb-2">New Flagship Programme</span>
              <h2 className="font-serif font-bold text-4xl lg:text-5xl text-gray-900 mb-4 leading-tight">
                {ELPRO.name}
              </h2>
              <div className="w-14 h-1 bg-brand-red rounded-full mb-6" />

              <p className="text-gray-500 leading-relaxed mb-5">{ELPRO.description}</p>

              {/* Launch quote */}
              <blockquote className="border-l-4 border-brand-green bg-gray-50 px-5 py-4 rounded-r-xl mb-6">
                <p className="text-gray-700 italic text-sm leading-relaxed mb-2">{ELPRO.launch_quote}</p>
                <cite className="text-brand-green text-xs font-bold not-italic">— {ELPRO.launch_speaker}</cite>
              </blockquote>

              <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">{ELPRO.elijah_quote}</p>

              <div className="flex flex-wrap gap-3">
                <Link to="/get-involved#elpro" className="btn-primary">
                  <ArrowRight size={16} /> Apply for ELPro
                </Link>
                <Link to="/get-involved#mentor" className="btn-outline-green">
                  Become a Mentor
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#0d0d0d]" ref={ref}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { value: 23, suffix: '', label: 'Fellows Enrolled' },
              { value: 12, suffix: '', label: 'Months Programme' },
              { value: 1, suffix: 'st', label: 'Inaugural Cohort' },
              { value: 2026, suffix: '', label: 'Year Launched' },
            ].map((stat, i) => (
              <div key={stat.label} className="py-10 px-6 border-r border-white/6 last:border-r-0 even:border-r-0 lg:even:border-r lg:last:border-r-0">
                <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionHeader label="What ELPro Does" title="Programme Objectives" center labelColor="red" dividerColor="red" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ELPRO.objectives.map((obj, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="flex gap-3 items-start bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-green transition-all duration-300">
                  <CheckCircle size={18} className="text-brand-green flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm leading-relaxed">{obj}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionHeader label="How It Works" title="The ELPro Journey" center labelColor="green" dividerColor="green" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {ELPRO.process.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.1} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-serif font-black text-2xl text-white mx-auto mb-4 border-4 border-white shadow-lg ${i % 2 === 0 ? 'bg-brand-red' : 'bg-brand-green'}`}>
                  {step.step}
                </div>
                <h5 className="font-bold text-gray-900 text-sm mb-2">{step.title}</h5>
                <p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ELPro vs GIPro — Legacy Section */}
      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3 block">Our Journey</span>
            <h2 className="font-serif font-bold text-white text-4xl mb-4">From GIPro to ELPro</h2>
            <div className="w-14 h-1 bg-brand-red rounded-full mx-auto mb-4" />
            <p className="text-white/60 max-w-2xl mx-auto text-sm leading-relaxed">
              Hesabika's leadership development journey has evolved. GIPro laid a powerful foundation — 50+ alumni serving Kenya. ELPro builds on that legacy with a deeper focus on ethical formation and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GIPro */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Shield size={20} className="text-white/60" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-white text-lg">GIPro</h3>
                  <p className="text-white/40 text-xs">Governance Internship Programme · 2021–2023</p>
                </div>
                <span className="ml-auto text-xs font-bold text-white/40 bg-white/8 px-3 py-1 rounded-full">Legacy</span>
              </div>
              <div className="space-y-3 text-sm text-white/60">
                <div className="flex justify-between"><span>Focus</span><span className="text-white/80 font-medium">Government internship placements</span></div>
                <div className="flex justify-between"><span>Duration</span><span className="text-white/80 font-medium">12 months</span></div>
                <div className="flex justify-between"><span>Alumni</span><span className="text-white/80 font-medium">50+ interns placed</span></div>
                <div className="flex justify-between"><span>Partners</span><span className="text-white/80 font-medium">KSG, CPST, JTI</span></div>
              </div>
              <Link to="/gipro" className="inline-flex items-center gap-2 text-white/50 text-xs font-semibold mt-5 hover:text-white transition-colors">
                View GIPro Alumni <ArrowRight size={12} />
              </Link>
            </motion.div>

            {/* ELPro */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-brand-green rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Star size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-white text-lg">ELPro</h3>
                    <p className="text-white/70 text-xs">Ethical Leaders Program · 2026–Present</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-full">Active</span>
                </div>
                <div className="space-y-3 text-sm text-white/80">
                  <div className="flex justify-between"><span className="text-white/60">Focus</span><span className="text-white font-medium">Ethical formation + accountability</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Duration</span><span className="text-white font-medium">12 months</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Fellows</span><span className="text-white font-medium">23 (inaugural cohort)</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Partners</span><span className="text-white font-medium">EACC, PSC, KSG, Katiba</span></div>
                </div>
                <Link to="/get-involved#elpro" className="inline-flex items-center gap-2 text-white text-xs font-bold mt-5 hover:gap-3 transition-all">
                  Apply Now <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-400">ELPro Partners</span>
            <h3 className="font-serif font-bold text-2xl text-gray-900 mt-2">Organisations We Work With</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {ELPRO.partners.map((partner) => (
              <div key={partner} className="bg-white border border-gray-100 rounded-xl px-6 py-3 shadow-sm">
                <span className="font-semibold text-gray-700 text-sm">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GIPro Stories — preserved */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionHeader label="GIPro Legacy" title="Stories from Our Alumni" description="50+ young Kenyans who served through GIPro — their stories inspire the ELPro generation." center labelColor="red" dividerColor="red" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.slice(0, 3).map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.1}>
                <BlogCard {...post} />
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gipro/interns" className="btn-outline-red">
              Meet All GIPro Alumni <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        label="Join ELPro"
        title="Ready to Be an Ethical Champion?"
        description="Applications for the next ELPro cohort are open. Join 23 fellows committed to transforming Kenya's governance from the inside."
        primaryText="Apply for ELPro"
        primaryHref="/get-involved#elpro"
        secondaryText="Become a Mentor"
        secondaryHref="/get-involved#mentor"
      />
    </>
  )
}