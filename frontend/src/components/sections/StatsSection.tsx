import { STATS } from '@/lib/data'
import StatCounter from '../ui/StatCounter'

export default function StatsSection() {
  return (
    <section className="bg-[#0d0d0d]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="py-10 px-6 border-r border-white/6 last:border-r-0 even:border-r-0 lg:even:border-r lg:last:border-r-0"
            >
              <StatCounter
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}