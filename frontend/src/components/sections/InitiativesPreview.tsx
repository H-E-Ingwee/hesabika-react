import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { INITIATIVES } from '@/lib/data'
import SectionHeader from '../ui/SectionHeader'

export default function InitiativesPreview() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section className="py-24 bg-white" id="initiatives" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <SectionHeader
            label="What We Do"
            title="Hesabika Initiatives"
            description="Six strategic areas where Hesabika is translating concern into action across Kenya."
            center
            labelColor="red"
            dividerColor="red"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIATIVES.map((initiative, i) => (
            <motion.div
              key={initiative.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={initiative.image}
                  alt={initiative.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-1.jpg' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Number */}
                <div className="absolute top-3 left-3 font-serif font-black text-white/20 text-5xl leading-none">
                  {initiative.number}
                </div>
              </div>

              {/* Body */}
              <div className="p-5">
                <span
                  className={`inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-3 ${
                    initiative.color === 'green'
                      ? 'text-brand-green bg-brand-green/8'
                      : 'text-brand-red bg-brand-red/8'
                  }`}
                >
                  {initiative.tag}
                </span>
                <h4 className="font-serif font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-brand-green transition-colors duration-200">
                  {initiative.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">
                  {initiative.description}
                </p>
                {initiative.external ? (
                  <a
                    href={initiative.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-green text-xs font-semibold hover:gap-2.5 transition-all duration-200"
                  >
                    Learn More <ExternalLink size={12} />
                  </a>
                ) : (
                  <Link
                    to={initiative.link}
                    className="inline-flex items-center gap-1.5 text-brand-green text-xs font-semibold hover:gap-2.5 transition-all duration-200"
                  >
                    Learn More <ArrowRight size={12} />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link to="/initiatives" className="btn-outline-red">
            View All Initiatives
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}