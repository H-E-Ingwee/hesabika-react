import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TeamCardProps {
  name: string
  role: string
  image: string
  bio?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  accentColor?: 'red' | 'green'
}

export default function TeamCard({
  name,
  role,
  image,
  bio,
  className,
  size = 'md',
  accentColor = 'green',
}: TeamCardProps) {
  const [imgError, setImgError] = useState(false)

  const sizeClasses = {
    sm: 'aspect-square',
    md: 'aspect-square',
    lg: 'h-72',
  }

  const accentClasses = {
    red: 'from-brand-red/90',
    green: 'from-brand-green/90',
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300',
        className
      )}
    >
      {/* Photo */}
      <div className={cn('relative overflow-hidden', sizeClasses[size])}>
        {!imgError ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-green/20 to-brand-red/10 flex items-center justify-center">
            <span className="font-serif font-bold text-3xl text-brand-green/60">
              {initials}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            accentClasses[accentColor]
          )}
        />

        {/* Bio on hover */}
        {bio && (
          <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-white text-xs leading-relaxed line-clamp-3">{bio}</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 text-center">
        <h4 className="font-serif font-bold text-gray-900 text-sm mb-1 leading-tight">
          {name}
        </h4>
        <p
          className={cn(
            'text-xs font-bold uppercase tracking-wider',
            accentColor === 'green' ? 'text-brand-green' : 'text-brand-red'
          )}
        >
          {role}
        </p>
      </div>
    </motion.div>
  )
}