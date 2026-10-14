import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  once?: boolean
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = 'up',
  once = true,
}: AnimatedSectionProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: once, rootMargin: '0px 0px -40px 0px' })

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 28 : direction === 'down' ? -28 : 0,
      x: direction === 'left' ? 28 : direction === 'right' ? -28 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}