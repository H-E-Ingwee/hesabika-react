import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, ChevronDown } from 'lucide-react'

const slides = [
  {
    image: '/images/hero-1.jpg',
    badge: 'Translating Concern into Action',
    title: 'We Believe in',
    highlight: 'Change',
    subtitle: 'for Kenya',
    description:
      'HESABIKA is FOCUS Kenya\'s Societal Transformation Arm — mobilizing Christians, professionals, students and the church to be salt and light in the world.',
    cta1: { label: 'Our Story', href: '/about' },
    cta2: { label: 'Get Involved', href: '/get-involved' },
  },
  {
    image: '/images/gipro-group.jpg',
    badge: '🆕 New Flagship Programme · April 2026',
    title: 'Ethical Leaders',
    highlight: 'Program',
    subtitle: '(ELPro)',
    description:
      'ELPro — building a critical mass of ethical champions within government, strengthening integrity in public service, and fostering intergenerational transfer of values. 23 fellows enrolled.',
    cta1: { label: 'Discover ELPro', href: '/elpro' },
    cta2: { label: 'Apply Now', href: '/get-involved#elpro' },
  },
  {
    image: '/images/hero-3.jpg',
    badge: 'Five Thematic Caucuses',
    title: 'Advocacy That',
    highlight: 'Speaks',
    subtitle: 'Truth to Power',
    description:
      'Five expert-led caucuses engaging Kenya\'s most pressing challenges — governance, economy, education, public theology, and health — from a distinctly biblical standpoint.',
    cta1: { label: 'Our Caucuses', href: '/caucuses' },
    cta2: { label: 'Advocacy Areas', href: '/advocacy' },
  },
  {
    image: '/images/hero-2.jpg',
    badge: 'GIPro Legacy · 50+ Alumni',
    title: 'Standing Up',
    highlight: 'and Being',
    subtitle: 'Counted',
    description:
      '50+ GIPro alumni serving Kenya across government, parliament, counties and constituencies. Their stories inspire the next generation of ethical leaders.',
    cta1: { label: 'GIPro Alumni', href: '/gipro/interns' },
    cta2: { label: 'GIPro Story', href: '/gipro' },
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [])

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(next, 5500)
    return () => clearInterval(timer)
  }, [isPlaying, next])

  const goTo = (i: number) => {
    setCurrent(i)
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 8000)
  }

  const slide = slides[current]

  return (
    <section className="relative h-screen min-h-[640px] overflow-hidden">
      {/* Background slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Red/green accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-transparent to-brand-green" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-brand-red/90 text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-6"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                {slide.badge}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-serif font-black text-white leading-[1.05] mb-5"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
              >
                {slide.title}{' '}
                <span className="text-[#f1ae2a]">{slide.highlight}</span>
                <br />
                {slide.subtitle}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-white/85 text-lg leading-relaxed max-w-xl mb-8"
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link to={slide.cta1.href} className="btn-primary">
                  <ArrowRight size={16} />
                  {slide.cta1.label}
                </Link>
                <Link to={slide.cta2.href} className="btn-outline-white">
                  {slide.cta2.label}
                </Link>
                {current === 0 && (
                  <a
                    href="https://youtu.be/QDPgdffese8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white/80 text-sm font-semibold hover:text-white transition-colors"
                  >
                    <span className="w-10 h-10 rounded-full border-2 border-white/40 flex items-center justify-content hover:border-white transition-colors flex items-center justify-center">
                      <Play size={14} className="ml-0.5" />
                    </span>
                    Theme Song
                  </a>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-7 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-white/50"
      >
        <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
        <ChevronDown size={14} />
      </motion.div>
    </section>
  )
}