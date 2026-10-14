import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import CTASection from '@/components/sections/CTASection'
import { fetchBoardMembers } from '@/lib/api'

function BoardCard({ member, index }: { member: any; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const [imgError, setImgError] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-xl)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
    >
      <div className="relative overflow-hidden h-72">
        {!imgError ? (
          <img
            src={member.image_url || member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-serif font-bold text-4xl text-brand-green"
            style={{ background: 'rgba(22,105,53,0.08)' }}>
            {member.name?.[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-green/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
          <p className="text-white text-xs leading-relaxed">{member.bio}</p>
        </div>
      </div>
      <div className="p-5">
        <h4 className="font-serif font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>{member.name}</h4>
        <div className="w-8 h-0.5 bg-brand-red rounded-full mb-2" />
        <p className="text-brand-green text-xs font-bold uppercase tracking-wider">{member.role}</p>
      </div>
    </motion.div>
  )
}

export default function BoardPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    fetchBoardMembers().then(data => { setMembers(data); setLoading(false) })
  }, [])

  return (
    <>
      <PageHero
        title="Board of Trustees"
        description="Meet the nine trustees who provide strategic oversight and governance for Hesabika Trust."
        image="/images/hero-1.jpg"
        breadcrumbs={[{ label: 'About', href: '/about' }, { label: 'Board of Trustees' }]}
      />

      <section className="py-24" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
            <SectionHeader label="Leadership" title="Our Board of Trustees"
              description="HESABIKA is registered as a Trust and has nine Trustees who provide strategic direction, accountability and governance oversight."
              center labelColor="red" dividerColor="red" />
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                  <div className="h-72 skeleton" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 skeleton rounded w-3/4" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member, i) => <BoardCard key={member.id} member={member} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* Secretariat link */}
      <section className="py-16" style={{ background: 'var(--bg-subtle)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div>
              <span className="section-label-green">Our Team</span>
              <h3 className="font-serif font-bold text-2xl mt-1" style={{ color: 'var(--text-primary)' }}>Meet the Secretariat</h3>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                The Hesabika Secretariat is the operational team that drives our programmes and initiatives day-to-day.
              </p>
            </div>
            <Link to="/about/secretariat" className="btn btn-secondary flex-shrink-0">
              View Secretariat <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}