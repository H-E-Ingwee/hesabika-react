import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Users } from 'lucide-react'
import AnimatedSection from '../ui/AnimatedSection'
import SectionHeader from '../ui/SectionHeader'

export default function AboutSection() {
  const { ref: sectionRef, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section className="py-24 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image Stack */}
          <AnimatedSection direction="left" className="relative">
            <div className="relative">
              <img
                src="/images/about.jpg"
                alt="Hesabika Team"
                className="w-full h-[520px] object-cover rounded-2xl shadow-2xl"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-2.jpg' }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 -right-6 w-48 h-36 rounded-xl overflow-hidden border-4 border-white shadow-xl hidden sm:block"
              >
                <img
                  src="/images/group-1.jpg"
                  alt="Hesabika Group"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-3.jpg' }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -top-4 -left-4 bg-brand-red text-white p-4 rounded-xl shadow-lg text-center hidden sm:block"
              >
                <span className="font-serif font-black text-2xl block">10+</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-85">Years of<br />Impact</span>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Content */}
          <div ref={sectionRef}>
            <AnimatedSection direction="right" delay={0.1}>
              <SectionHeader
                label="Who We Are"
                title="Stand Up and Be Counted for the Transformation of Kenya"
                labelColor="red"
                dividerColor="red"
              />

              <p className="text-gray-500 leading-relaxed mb-4">
                HESABIKA is a catalyst for a value-driven socio-economic transformation of Kenya. It is a call, first to Christian professionals, students and the church at large to be salt and light in the world.
              </p>

              <blockquote className="border-l-4 border-brand-green bg-gray-50 px-5 py-4 rounded-r-xl my-5 italic text-gray-700 text-sm leading-relaxed">
                "The only thing necessary for the triumph of evil is for good men to do nothing." — Edmund Burke
              </blockquote>

              <p className="text-gray-500 leading-relaxed mb-6">
                The Hesabika call is for everyone: A Call to stand up and be counted. A call to translate concern into action. A call to be an agent of transformation in your sphere of influence — in your family, workplace, community and nation.
              </p>

              <p className="text-gray-500 leading-relaxed mb-8">
                HESABIKA was started as an initiative of Fellowship of Christian Unions (FOCUS) Kenya and was launched at the first HESABIKA National Convention in April 2016. HESABIKA is registered as a Trust and has nine Trustees.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/about" className="btn-secondary">
                  <ArrowRight size={16} />
                  Learn More
                </Link>
                <Link to="/get-involved" className="btn-outline-red">
                  <Users size={16} />
                  Join the Movement
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}