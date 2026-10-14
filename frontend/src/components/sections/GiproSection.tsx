import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CheckCircle, ArrowRight, Building2, GraduationCap, Users } from 'lucide-react'
import SectionHeader from '../ui/SectionHeader'
import AnimatedSection from '../ui/AnimatedSection'

const features = [
  {
    icon: GraduationCap,
    title: '12-Month Intensive Programme',
    description: 'Training, mentorship, coaching and internship in government departments, parliament, counties and constituencies.',
  },
  {
    icon: Building2,
    title: 'Government Partnerships',
    description: 'Partnered with Kenya School of Government (KSG), Centre for Parliamentary Studies (CPST), and Judiciary Training Institute (JTI).',
  },
  {
    icon: Users,
    title: '40+ Experienced Mentors',
    description: 'Each intern is paired with an experienced professional mentor who guides them through their governance journey.',
  },
]

const partners = [
  { name: 'KSG', image: '/images/partner-ksg.png' },
  { name: 'GOK', image: '/images/partner-gok.png' },
  { name: 'FOCUS Kenya', image: '/images/partner-focus.png' },
  { name: 'Tearfund', image: '/images/partner-tearfund.png' },
]

export default function GiproSection() {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <section className="py-24 bg-gray-50" id="gipro" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Stack */}
          <AnimatedSection direction="left" className="relative order-2 lg:order-1">
            <div className="relative">
              <img
                src="/images/gipro-group.jpg"
                alt="GIPro Interns"
                className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-2.jpg' }}
              />
              {/* Overlay image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-5 -right-5 w-44 h-32 rounded-xl overflow-hidden border-4 border-white shadow-xl hidden sm:block"
              >
                <img
                  src="/images/jti.jpg"
                  alt="JTI Partnership"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/mentorship.jpg' }}
                />
              </motion.div>
              {/* Stat badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -top-4 -left-4 bg-brand-green text-white p-4 rounded-xl shadow-lg text-center hidden sm:block"
              >
                <span className="font-serif font-black text-2xl block">50+</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-85">Interns<br />Placed</span>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Content */}
          <AnimatedSection direction="right" delay={0.1} className="order-1 lg:order-2">
            <SectionHeader
              label="Flagship Programme"
              title="Governance Internship Programme (GIPro)"
              labelColor="green"
              dividerColor="green"
            />

            <p className="text-gray-500 leading-relaxed mb-2">
              As Edmund Burke said, <em>"The only thing necessary for the triumph of evil is for good men to do nothing."</em>
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              GIPro aims at contributing to the pipeline of leadership development in Kenya's governance sector — placing young men and women who will not simply watch their country and future waste away.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-7">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-10 h-10 min-w-[40px] bg-brand-green/10 rounded-xl flex items-center justify-center">
                    <feature.icon size={18} className="text-brand-green" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 text-sm mb-0.5">{feature.title}</h5>
                    <p className="text-gray-500 text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* MPESA highlight */}
            <div className="bg-brand-green/8 border border-brand-green/20 rounded-xl p-4 mb-6">
              <p className="text-brand-green text-sm font-semibold mb-1">💚 Support an Intern — KES 1,000/month</p>
              <p className="text-gray-600 text-xs">MPESA Paybill: <strong>769936</strong> · Account: <strong>GIPro</strong></p>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/gipro" className="btn-secondary">
                <ArrowRight size={16} />
                Learn About GIPro
              </Link>
              <Link to="/get-involved" className="btn-outline-green">
                Support an Intern
              </Link>
            </div>

            {/* Partners */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Our Partners</p>
              <div className="flex gap-4 flex-wrap items-center">
                {partners.map((p) => (
                  <img
                    key={p.name}
                    src={p.image}
                    alt={p.name}
                    className="h-9 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}