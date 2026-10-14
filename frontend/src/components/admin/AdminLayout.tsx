import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Users, UserCheck, Shield,
  Mail, Bell, Download, Calendar, Settings, LogOut,
  Menu, X, ChevronRight, Star, MessageSquare, Heart,
  BookOpen, Megaphone
} from 'lucide-react'
import { signOut } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { label: 'ELPro Fellows', href: '/admin/elpro', icon: Star },
  { label: 'GIPro Alumni', href: '/admin/interns', icon: Users },
  { label: 'Mentors', href: '/admin/mentors', icon: UserCheck },
  { label: 'Board Members', href: '/admin/board', icon: Shield },
  { label: 'Secretariat', href: '/admin/secretariat', icon: Users },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: 'unread' },
  { label: 'Applications', href: '/admin/applications', icon: BookOpen },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Bell },
  { label: 'Events', href: '/admin/events', icon: Calendar },
  { label: 'Downloads', href: '/admin/downloads', icon: Download },
  { label: 'Donations', href: '/admin/donations', icon: Heart },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/admin/login')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href)

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(
      'flex flex-col h-full bg-[#0d0d0d] border-r border-white/6',
      mobile ? 'w-72' : sidebarOpen ? 'w-64' : 'w-16'
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/6">
        <img src="/images/logo.png" alt="Hesabika" className="h-8 w-auto brightness-0 invert flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        {(sidebarOpen || mobile) && (
          <div>
            <p className="text-white font-bold text-sm leading-tight">Hesabika</p>
            <p className="text-white/40 text-xs">Admin CMS</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => mobile && setMobileSidebarOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
              isActive(item.href, item.exact)
                ? 'bg-brand-green text-white'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            )}
          >
            <item.icon size={18} className="flex-shrink-0" />
            {(sidebarOpen || mobile) && (
              <>
                <span className="flex-1">{item.label}</span>
                {isActive(item.href, item.exact) && <ChevronRight size={14} />}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-white/6">
        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-brand-red/20 transition-all duration-200 w-full',
          )}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {(sidebarOpen || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0 transition-all duration-300">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
            >
              <Sidebar mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSidebarOpen(!sidebarOpen)
                setMobileSidebarOpen(!mobileSidebarOpen)
              }}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-serif font-bold text-gray-900 text-xl">{title}</h1>
              {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <Link
              to="/"
              target="_blank"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              View Site →
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}