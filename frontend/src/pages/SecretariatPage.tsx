import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import TeamCard from '@/components/ui/TeamCard'
import { SECRETARIAT } from '@/lib/data'

export default function SecretariatPage() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <>
      <PageHero
        title="The Secretariat"
        description="Meet the dedicated team driving Hesabika's programmes and initiatives across Kenya."
        image="/images/hero-4.jpg"
        breadcrumbs={[{ label: 'About', href: '/about' }, { label: 'Secretariat' }]}
      />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <SectionHeader
              label="Our Team"
              title="Hesabika Secretariat"
              description="The Hesabika Secretariat is the operational team that drives our programmes, manages our relationships and advances our mission day-to-day."
              center
              labelColor="red"
              dividerColor="red"
            />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {SECRETARIAT.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              >
                <TeamCard
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  accentColor="red"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Board link */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="section-label">Governance</span>
              <h3 className="font-serif font-bold text-2xl text-gray-900 mt-1">Meet the Board of Trustees</h3>
              <p className="text-gray-500 text-sm mt-2">
                The Board of Trustees provides strategic oversight and governance for Hesabika Trust.
              </p>
            </div>
            <Link to="/about/board" className="btn-primary flex-shrink-0">
              View Board <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}