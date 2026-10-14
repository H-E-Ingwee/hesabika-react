import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Play, ChevronDown, Sparkles } from 'lucide-react'

const slides = [
  {
    image: '/images/hero-1.jpg',
    badge: 'Translating Concern into Action',
    title: 'We Believe in',
    highlight: 'Change',
    subtitle: 'for Kenya',
    description: "HESABIKA is FOCUS Kenya's Societal Transformation Arm — mobilizing Christians, professionals, students and the church to be salt and light in the world.",
    cta1: { label: 'Our Story', href: '/about' },
    cta2: { label: 'Get Involved', href: '/get-involved' },
    accent: 'from-brand-red/20',
  },
  {
    image: '/images/gipro-group.jpg',
    badge: 'New Flagship Programme · April 2026',
    title: 'Ethical Leaders',
    highlight: 'Program',
    subtitle: '(ELPro)',
    description: 'Building a critical mass of ethical champions within government, strengthening integrity in public service. 23 fellows enrolled in the inaugural cohort.',
    cta1: { label: 'Discover ELPro', href: '/elpro' },
    cta2: { label: 'Apply Now', href: '/get-involved#elpro' },
    accent: 'from-brand-green/20',
  },
  {
    image: '/images/hero-3.jpg',
    badge: 'Five Thematic Caucuses',
    title: 'Advocacy That',
    highlight: 'Speaks',
    subtitle: 'Truth to Power',
    description: "Five expert-led caucuses engaging Kenya's most pressing challenges — governance, economy, education, public theology, and health — from a distinctly biblical standpoint.",
    cta1: { label: 'Our Caucuses', href: '/caucuses' },
    cta2: { label: 'Advocacy Areas', href: '/advocacy' },
    accent: 'from-brand-red/20',
  },
  {
    image: '/images/hero-2.jpg',
    badge: 'GIPro Legacy · 50+ Alumni',
    title: 'Standing Up',
    highlight: 'and Being',
    subtitle: 'Counted',
    description: '50+ GIPro alumni serving Kenya across government, parliament, counties and constituencies. Their stories inspire the next generation of ethical leaders.',
    cta1: { label: 'GIPro Alumni', href: '/gipro/interns' },
    cta2: { label: 'GIPro Story', href: '/gipro' },
    accent: 'from-brand-green/20',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [])

  useEffect(() => {
    if (!isPlaying) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [isPlaying, next])

  const goTo = (i: number) => {
    setCurrent(i)
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), 10000)
  }

  const slide = slides[current]

  return (
    <section className="relative h-screen min-h-[680px] overflow-hidden">
      {/* Background with Ken Burns */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.2 }, scale: { duration: 8, ease: 'linear' } }}
          className="absolute inset-0"
          style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      </AnimatePresence>

      {/* Multi-layer overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent" />
      <div className={`absolute inset-0 bg-gradient-to-tr ${slide.accent} to-transparent opacity-60 transition-all duration-1000`} />
      <div className="absolute inset-0 bg-noise opacity-30" />

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-red via-brand-green to-brand-red" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <span className="flex items-center gap-2 bg-brand-red/90 backdrop-blur-sm text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-brand-red/50">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  {slide.badge}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif font-black text-white leading-[1.04] mb-5 text-balance"
                style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
              >
                {slide.title}{' '}
                <span className="relative inline-block">
                  <span className="gradient-text">{slide.highlight}</span>
                </span>
                <br />
                <span className="text-white/90">{slide.subtitle}</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-white/80 text-lg leading-relaxed max-w-xl mb-8 font-light"
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                <Link to={slide.cta1.href} className="btn btn-primary group">
                  {slide.cta1.label}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to={slide.cta2.href} className="btn btn-outline-white">
                  {slide.cta2.label}
                </Link>
                {current === 0 && (
                  <a
                    href="https://youtu.be/QDPgdffese8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-white/70 text-sm font-medium hover:text-white transition-colors group"
                  >
                    <span className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center group-hover:border-white group-hover:bg-white/10 transition-all">
                      <Play size={13} className="ml-0.5" />
                    </span>
                    Theme Song
                  </a>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative overflow-hidden rounded-full transition-all duration-400"
            style={{ width: i === current ? '32px' : '8px', height: '8px' }}
            aria-label={`Slide ${i + 1}`}
          >
            <span className="absolute inset-0 rounded-full bg-white/30" />
            {i === current && (
              <motion.span
                layoutId="slide-indicator"
                className="absolute inset-0 rounded-full bg-white"
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 right-8 z-20 flex flex-col items-center gap-1.5"
      >
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        <ChevronDown size={14} className="text-white/40" />
      </motion.div>
    </section>
  )
}