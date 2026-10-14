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

  const labelColors = {
    red: 'text-brand-red',
    green: 'text-brand-green',
    white: 'text-white/60',
  }

  const dividerColors = {
    red: 'bg-brand-red',
    green: 'bg-brand-green',
    white: 'bg-white',
  }

  return (
    <div
      ref={ref}
      className={cn(center && 'text-center', className)}
    >
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className={cn(
            'inline-block text-xs font-bold tracking-widest uppercase mb-3',
            labelColors[labelColor]
          )}
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={cn(
          'font-serif font-bold',
          'text-3xl sm:text-4xl lg:text-5xl',
          light ? 'text-white' : 'text-gray-900'
        )}
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ transformOrigin: center ? 'center' : 'left' }}
        className={cn(
          'w-14 h-1 rounded-full my-4',
          center && 'mx-auto',
          dividerColors[dividerColor]
        )}
      />
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className={cn(
            'text-base leading-relaxed',
            light ? 'text-white/70' : 'text-gray-500',
            center && 'max-w-2xl mx-auto'
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}