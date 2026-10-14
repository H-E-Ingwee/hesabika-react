import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Award, Users, MapPin } from 'lucide-react'
import { GIPRO_INTERNS } from '@/lib/data'
import SectionHeader from '../ui/SectionHeader'

export default function GiproLegacy() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  // Show a sample of interns
  const featured = GIPRO_INTERNS.slice(0, 10)

  return (
    <section className="py-24 bg-white" id="gipro-legacy" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">
              <Award size={12} />
              2021 – 2023 · Programme Completed
            </div>
            <SectionHeader
              label="Our Legacy"
              title="GIPro — Governance Internship Programme"
              labelColor="red"
              dividerColor="red"
            />
            <p className="text-gray-500 leading-relaxed mb-4">
              GIPro was Hesabika's flagship governance internship programme — placing 50+ young, values-driven Kenyans in government institutions for 12 months of intensive training, mentorship, and real-world public service.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              GIPro laid the foundation for what Hesabika is today. Its alumni are now serving across Kenya's government, private sector, and civil society — living proof that values-driven leadership changes nations.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/gipro/interns" className="btn-outline-red">
                <Users size={16} /> Meet the Alumni
              </Link>
              <Link to="/gipro" className="btn-outline-green">
                GIPro Story <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: '50+', label: 'Interns Placed', icon: Users, color: 'bg-brand-red' },
              { value: '40+', label: 'Mentors', icon: Award, color: 'bg-brand-green' },
              { value: '3', label: 'Cohorts', icon: Award, color: 'bg-brand-green' },
              { value: '12', label: 'Months Each', icon: MapPin, color: 'bg-brand-red' },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon size={18} className="text-white" />
                </div>
                <div className="font-serif font-black text-3xl text-gray-900 mb-1">{stat.value}</div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Alumni photo grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">GIPro Alumni</p>
            <Link to="/gipro/interns" className="text-brand-green text-xs font-semibold hover:underline flex items-center gap-1">
              View all 50+ <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {featured.map((intern, i) => (
              <motion.div
                key={intern.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
                className="group relative"
                title={intern.name}
              >
                <div className="aspect-square rounded-xl overflow-hidden border-2 border-transparent group-hover:border-brand-green transition-all duration-300">
                  <img
                    src={intern.image}
                    alt={intern.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-400"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement
                      el.src = '/images/board-Hesabika-Noimg.jpg'
                    }}
                  />
                </div>
              </motion.div>
            ))}
            {/* +more indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              <Link to="/gipro/interns" className="aspect-square rounded-xl bg-brand-green flex items-center justify-center text-white font-bold text-xs hover:bg-brand-green-dark transition-colors">
                +40<br />more
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Transition note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 bg-gradient-to-r from-brand-red/5 to-brand-green/5 border border-gray-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5"
        >
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <div className="font-serif font-black text-2xl text-gray-400">GIPro</div>
              <div className="text-xs text-gray-400">2021–2023</div>
            </div>
            <ArrowRight size={20} className="text-gray-300" />
            <div className="text-center">
              <div className="font-serif font-black text-2xl text-brand-green">ELPro</div>
              <div className="text-xs text-brand-green font-semibold">2026–Present</div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 text-sm leading-relaxed">
              GIPro's legacy lives on in ELPro — the Ethical Leaders Program. Building on 50+ alumni and years of learning, ELPro deepens the focus on ethical formation, mentorship, and accountability for those serving in Kenya's civic spaces.
            </p>
          </div>
          <Link to="/elpro" className="btn-secondary text-sm py-2.5 px-5 flex-shrink-0">
            Discover ELPro <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}