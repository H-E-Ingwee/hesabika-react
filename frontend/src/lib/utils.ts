import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMMM d, yyyy')
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function readTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatCurrency(amount: number, currency = 'KES'): string {
  return `${currency} ${amount.toLocaleString()}`
}

export const CLOUDINARY_BASE = 'https://res.cloudinary.com/ohwpmgr1/image/upload'

export function cloudinaryUrl(publicId: string, transforms = 'w_800,h_600,c_fill,q_auto,f_auto'): string {
  return `${CLOUDINARY_BASE}/${transforms}/${publicId}`
}

export function getImageUrl(path: string): string {
  if (!path) return '/images/placeholder.jpg'
  if (path.startsWith('http')) return path
  if (path.startsWith('cloudinary:')) return cloudinaryUrl(path.replace('cloudinary:', ''))
  return path
}

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('hesabika_token')
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }
  return res.json()
}