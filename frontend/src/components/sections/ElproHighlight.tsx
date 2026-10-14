import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Award, Shield, Users, CheckCircle } from 'lucide-react'
import { ELPRO } from '@/lib/data'

export default function ElproHighlight() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section className="py-24 bg-[#0d0d0d] relative overflow-hidden" id="elpro" ref={ref}>
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-brand-green blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-brand-red blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-brand-red/15 text-brand-red text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4 border border-brand-red/20">
            <Award size={13} />
            New Flagship Programme · Launched April 2026
          </div>
          <h2 className="font-serif font-bold text-white text-4xl lg:text-5xl mb-4">
            {ELPRO.name}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">{ELPRO.tagline}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-white/70 leading-relaxed mb-6">{ELPRO.description}</p>

            <blockquote className="border-l-4 border-brand-green bg-white/5 px-5 py-4 rounded-r-xl mb-6">
              <p className="text-white/80 italic text-sm leading-relaxed mb-2">{ELPRO.launch_quote}</p>
              <cite className="text-brand-green text-xs font-bold not-italic">— {ELPRO.launch_speaker}</cite>
            </blockquote>

            <div className="space-y-3 mb-8">
              {ELPRO.objectives.slice(0, 3).map((obj, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex gap-3 items-start"
                >
                  <CheckCircle size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                  <p className="text-white/65 text-sm">{obj}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/elpro" className="btn-primary">
                <ArrowRight size={16} /> Learn About ELPro
              </Link>
              <Link to="/get-involved#elpro" className="btn-outline-white">
                Apply Now
              </Link>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Main stat */}
            <div className="bg-brand-green rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Award size={20} className="text-white" />
                  <span className="text-white/70 text-sm font-semibold">Inaugural Cohort 2026</span>
                </div>
                <div className="font-serif font-black text-white text-6xl mb-2">23</div>
                <p className="text-white/80 text-sm">Fellows enrolled · April 2026 – April 2027</p>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: 'Mentorship Pairing', desc: 'Each fellow paired with an experienced mentor' },
                { icon: Shield, label: 'Accountability', desc: 'Support systems for those in civic spaces' },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 border border-white/8 rounded-xl p-5">
                  <item.icon size={18} className="text-brand-red mb-3" />
                  <h5 className="text-white font-bold text-sm mb-1">{item.label}</h5>
                  <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Partners */}
            <div className="bg-white/5 border border-white/8 rounded-xl p-5">
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3">ELPro Partners</p>
              <div className="flex flex-wrap gap-2">
                {ELPRO.partners.map((p) => (
                  <span key={p} className="text-xs text-white/60 bg-white/8 px-3 py-1 rounded-full font-medium">{p}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}