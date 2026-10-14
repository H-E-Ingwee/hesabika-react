import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import CTASection from '@/components/sections/CTASection'
import { INITIATIVES } from '@/lib/data'

function InitiativeBlock({ initiative, index }: { initiative: typeof INITIATIVES[0]; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })
  const isEven = index % 2 === 0

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 last:mb-0">
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7 }}
        className={isEven ? 'order-1' : 'order-1 lg:order-2'}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={initiative.image}
            alt={initiative.title}
            className="w-full h-[420px] object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-1.jpg' }}
          />
          <div className="absolute top-4 left-4">
            <span className="font-serif font-black text-white/15 text-7xl leading-none">
              {initiative.number}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 30 : -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className={isEven ? 'order-2' : 'order-2 lg:order-1'}
      >
        <span
          className={`inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4 ${
            initiative.color === 'green'
              ? 'text-brand-green bg-brand-green/8'
              : 'text-brand-red bg-brand-red/8'
          }`}
        >
          {initiative.tag}
        </span>
        <h2 className="font-serif font-bold text-3xl lg:text-4xl text-gray-900 mb-4 leading-tight">
          {initiative.title}
        </h2>
        <div
          className={`w-12 h-1 rounded-full mb-5 ${
            initiative.color === 'green' ? 'bg-brand-green' : 'bg-brand-red'
          }`}
        />
        <p className="text-gray-500 leading-relaxed mb-3">{initiative.description}</p>
        <p className="text-gray-500 leading-relaxed mb-7">{initiative.detail}</p>

        {initiative.external ? (
          <a
            href={initiative.link}
            target="_blank"
            rel="noopener noreferrer"
            className={initiative.color === 'green' ? 'btn-secondary' : 'btn-primary'}
          >
            Learn More <ExternalLink size={16} />
          </a>
        ) : (
          <Link
            to={initiative.link}
            className={initiative.color === 'green' ? 'btn-secondary' : 'btn-primary'}
          >
            Learn More <ArrowRight size={16} />
          </Link>
        )}
      </motion.div>
    </div>
  )
}

export default function InitiativesPage() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <>
      <PageHero
        title="Hesabika Initiatives"
        description="Six strategic areas where Hesabika is translating concern into action across Kenya."
        image="/images/hero-3.jpg"
        breadcrumbs={[{ label: 'Initiatives' }]}
      />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <SectionHeader
              label="What We Do"
              title="Six Areas of Action"
              description="Hesabika works across six strategic areas to mobilize Kenyans for transformation — from governance to the marketplace, from the church to the classroom."
              center
              labelColor="red"
              dividerColor="red"
            />
          </motion.div>

          {INITIATIVES.map((initiative, i) => (
            <InitiativeBlock key={initiative.id} initiative={initiative} index={i} />
          ))}

          {/* Civic Education Event Banner */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 bg-[#0d0d0d] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-white/5"
          >
            <img
              src="/images/launch-flyer.png"
              alt="Civic Education Launch"
              className="w-full h-64 lg:h-auto object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-1.jpg' }}
            />
            <div className="p-10 flex flex-col justify-center">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-red mb-3">
                Upcoming Initiative
              </span>
              <h2 className="font-serif font-bold text-white text-3xl mb-4">
                Civic Education Launch
              </h2>
              <p className="text-white/65 leading-relaxed mb-6">
                Hesabika is launching a comprehensive Civic Education programme to expand our reach to all Kenyans — equipping citizens with the knowledge and tools to participate meaningfully in Kenya's governance.
              </p>
              <div className="bg-white/8 rounded-xl px-5 py-3 inline-block mb-6 w-fit">
                <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-1">Event Date</div>
                <div className="font-serif font-bold text-white text-xl">19 September 2026</div>
              </div>
              <Link to="/contact" className="btn-primary w-fit">
                Register Interest <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <CTASection
        title="Support Hesabika's Initiatives"
        description="Every contribution — of time, talent or treasure — helps Hesabika translate concern into action across Kenya."
        primaryText="Get Involved"
        primaryHref="/get-involved"
        secondaryText="Contact Us"
        secondaryHref="/contact"
      />
    </>
  )
}