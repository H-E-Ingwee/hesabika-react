import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  center?: boolean
  light?: boolean
  labelColor?: 'red' | 'green' | 'white'
  dividerColor?: 'red' | 'green' | 'white'
  className?: string
}

export default function SectionHeader({
  label,
  title,
  description,
  center = false,
  light = false,
  labelColor = 'red',
  dividerColor = 'red',
  className,
}: SectionHeaderProps) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const labelStyle = {
    red: { color: 'var(--brand-red)' },
    green: { color: 'var(--brand-green)' },
    white: { color: 'rgba(255,255,255,0.6)' },
  }[labelColor]

  const dividerStyle = {
    red: { background: 'var(--brand-red)' },
    green: { background: 'var(--brand-green)' },
    white: { background: 'rgba(255,255,255,0.7)' },
  }[dividerColor]

  return (
    <div ref={ref} className={cn(center && 'text-center', className)}>
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-block text-xs font-bold tracking-widest uppercase mb-3"
          style={labelStyle}
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.08 }}
        className="font-serif font-bold leading-tight"
        style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
          color: light ? '#ffffff' : 'var(--text-primary)',
        }}
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.18 }}
        style={{
          width: '48px',
          height: '3px',
          borderRadius: '2px',
          margin: center ? '0.75rem auto 1.25rem' : '0.75rem 0 1.25rem',
          transformOrigin: center ? 'center' : 'left',
          ...dividerStyle,
        }}
      />
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="text-base leading-relaxed"
          style={{
            color: light ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)',
            maxWidth: center ? '640px' : undefined,
            margin: center ? '0 auto' : undefined,
          }}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}