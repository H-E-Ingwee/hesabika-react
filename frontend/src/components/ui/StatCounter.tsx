import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

interface StatCounterProps {
  value: number
  suffix?: string
  label: string
  className?: string
  light?: boolean
  duration?: number
}

export default function StatCounter({
  value,
  suffix = '',
  label,
  className,
  light = true,
  duration = 1800,
}: StatCounterProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true })
  const started = useRef(false)

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true
      const step = value / (duration / 16)
      let current = 0
      const timer = setInterval(() => {
        current = Math.min(current + step, value)
        setCount(Math.floor(current))
        if (current >= value) clearInterval(timer)
      }, 16)
      return () => clearInterval(timer)
    }
  }, [inView, value, duration])

  return (
    <div ref={ref} className={cn('text-center', className)}>
      <div
        className={cn(
          'font-serif font-black text-5xl leading-none mb-2',
          light ? 'text-white' : 'text-gray-900'
        )}
      >
        <span>{count}</span>
        {suffix && <span className="text-brand-red">{suffix}</span>}
      </div>
      <div
        className={cn(
          'text-xs font-bold tracking-widest uppercase',
          light ? 'text-white/50' : 'text-gray-400'
        )}
      >
        {label}
      </div>
    </div>
  )
}