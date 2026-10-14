import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Users, UserCheck, Shield,
  Mail, Bell, Download, Calendar, Settings, LogOut,
  Menu, X, ChevronRight, Star, MessageSquare, Heart,
  BookOpen, Megaphone, ChevronLeft
} from 'lucide-react'
import { signOut } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
    ],
  },
  {
    label: 'Programmes',
    items: [
      { label: 'ELPro Fellows', href: '/admin/elpro', icon: Star },
      { label: 'GIPro Alumni', href: '/admin/interns', icon: Users },
      { label: 'Mentors', href: '/admin/mentors', icon: UserCheck },
    ],
  },
  {
    label: 'Organisation',
    items: [
      { label: 'Board Members', href: '/admin/board', icon: Shield },
      { label: 'Secretariat', href: '/admin/secretariat', icon: Users },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
      { label: 'Applications', href: '/admin/applications', icon: BookOpen },
      { label: 'Newsletter', href: '/admin/newsletter', icon: Bell },
      { label: 'Events', href: '/admin/events', icon: Calendar },
      { label: 'Downloads', href: '/admin/downloads', icon: Download },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out')
      navigate('/admin/login')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? location.pathname === href : location.pathname.startsWith(href)

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('flex flex-col h-full bg-white border-r border-gray-100', mobile ? 'w-64' : collapsed ? 'w-[60px]' : 'w-56')}>
      {/* Logo */}
      <div className={cn('flex items-center border-b border-gray-100 flex-shrink-0', collapsed && !mobile ? 'justify-center px-3 py-4' : 'gap-2.5 px-4 py-4')}>
        <img src="/images/logo.png" alt="Hesabika" className="h-7 w-auto flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-tight truncate">Hesabika</p>
            <p className="text-gray-400 text-[10px] truncate">Admin Dashboard</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map(group => (
          <div key={group.label}>
            {(!collapsed || mobile) && (
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest px-2 mb-1.5">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.href, (item as any).exact)
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => mobile && setMobileSidebarOpen(false)}
                    title={collapsed && !mobile ? item.label : undefined}
                    className={cn(
                      'flex items-center rounded-lg text-sm font-medium transition-all duration-150 group',
                      collapsed && !mobile ? 'justify-center w-9 h-9 mx-auto' : 'gap-2.5 px-2.5 py-2',
                      active
                        ? 'bg-brand-green/10 text-brand-green'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    <item.icon size={16} className={cn('flex-shrink-0', active ? 'text-brand-green' : 'text-gray-400 group-hover:text-gray-600')} />
                    {(!collapsed || mobile) && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {(!collapsed || mobile) && active && (
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn('border-t border-gray-100 p-2 flex-shrink-0', collapsed && !mobile ? 'flex justify-center' : '')}>
        <button
          onClick={handleSignOut}
          title={collapsed && !mobile ? 'Sign Out' : undefined}
          className={cn(
            'flex items-center gap-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-brand-red hover:bg-brand-red/5 transition-all duration-150',
            collapsed && !mobile ? 'w-9 h-9 justify-center' : 'w-full px-2.5 py-2'
          )}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {(!collapsed || mobile) && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 relative">
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.22 }}
              className="fixed left-0 top-0 bottom-0 z-50 lg:hidden shadow-xl"
            >
              <SidebarContent mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900 text-base leading-tight">{title}</h1>
              {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              View Site
              <ChevronRight size={12} />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  )
}