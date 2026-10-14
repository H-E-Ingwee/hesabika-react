import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'
import { cn } from '@/lib/utils'

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
  slug,
  title,
  excerpt,
  author,
  category,
  image,
  created_at,
  read_time,
  featured = false,
  className,
}: BlogCardProps) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col',
        className
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const t = e.target as HTMLImageElement
            t.src = '/images/blog-1.jpg'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Category tag */}
        <div className="absolute top-3 left-3">
          <span className="tag-red text-[10px]">{category}</span>
        </div>

        {featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-brand-green text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-brand-green transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
          {excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="font-medium text-gray-600">{author}</span>
            <span>·</span>
            <span>{formatDateShort(created_at)}</span>
            <span>·</span>
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