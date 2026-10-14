import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, Calendar } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'

interface BlogCardProps {
  id: string
  slug: string
  title: string
  excerpt: string
  author: string
  category: string
  image: string
  created_at: string
  read_time: number
  featured?: boolean
  className?: string
}

export default function BlogCard({
  slug, title, excerpt, author, category, image, created_at, read_time, featured = false,
}: BlogCardProps) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52 flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/blog-1.jpg' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Category */}
        <div className="absolute top-3 left-3">
          <span className="tag-red text-[10px]">{category}</span>
        </div>

        {featured && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-brand-green px-2.5 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-serif font-bold text-base leading-snug mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-brand-green"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-3 flex-1 mb-4" style={{ color: 'var(--text-muted)' }}>
          {excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{author}</span>
            <span style={{ color: 'var(--border-default)' }}>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {read_time} min
            </span>
          </div>
          <Link
            to={`/blog/${slug}`}
            className="text-brand-green text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all duration-200"
          >
            Read <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}