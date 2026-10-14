import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import { BOARD_MEMBERS } from '@/lib/data'

function BoardCard({ member, index }: { member: typeof BOARD_MEMBERS[0]; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
    >
      <div className="relative overflow-hidden h-72">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const el = e.target as HTMLImageElement
            el.src = '/images/board-Hesabika-Noimg.jpg'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
          <p className="text-white text-xs leading-relaxed">{member.bio}</p>
        </div>
      </div>
      <div className="p-5">
        <h4 className="font-serif font-bold text-gray-900 text-base mb-1">{member.name}</h4>
        <div className="w-8 h-0.5 bg-brand-red rounded-full mb-2" />
        <p className="text-brand-green text-xs font-bold uppercase tracking-wider">{member.role}</p>
      </div>
    </motion.div>
  )
}

export default function BoardPage() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <>
      <PageHero
        title="Board of Trustees"
        description="Meet the nine trustees who provide strategic oversight and governance for Hesabika Trust."
        image="/images/hero-1.jpg"
        breadcrumbs={[{ label: 'About', href: '/about' }, { label: 'Board of Trustees' }]}
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
              label="Leadership"
              title="Our Board of Trustees"
              description="HESABIKA is registered as a Trust and has nine Trustees who provide strategic direction, accountability and governance oversight."
              center
              labelColor="red"
              dividerColor="red"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BOARD_MEMBERS.map((member, i) => (
              <BoardCard key={member.id} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Secretariat link */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="section-label-green">Our Team</span>
              <h3 className="font-serif font-bold text-2xl text-gray-900 mt-1">Meet the Secretariat</h3>
              <p className="text-gray-500 text-sm mt-2">
                The Hesabika Secretariat is the operational team that drives our programmes and initiatives day-to-day.
              </p>
            </div>
            <Link to="/about/secretariat" className="btn-secondary flex-shrink-0">
              View Secretariat <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}