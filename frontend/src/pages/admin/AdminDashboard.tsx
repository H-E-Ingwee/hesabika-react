import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MessageSquare, Users, BookOpen, Bell, FileText, Star,
  ArrowRight, TrendingUp, Activity, Clock, CheckCircle,
  AlertCircle, Eye, Edit2, Trash2, RefreshCw, Award,
  Landmark, Calendar, Download, Settings, Shield
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { fetchAdminStats, fetchRecentActivity } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { formatDateShort, timeAgo } from '@/lib/utils'
import { cn } from '@/lib/utils'

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  message: MessageSquare,
  intern_app: Star,
  mentor_app: Users,
  subscriber: Bell,
  blog_post: FileText,
}

const ACTIVITY_COLORS: Record<string, string> = {
  message: 'var(--brand-red)',
  intern_app: 'var(--brand-green)',
  mentor_app: 'var(--brand-red)',
  subscriber: 'var(--brand-green)',
  blog_post: 'var(--brand-red)',
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { profile, role, isSuperAdmin, isAdmin } = useRole()
  const [stats, setStats] = useState<any>(null)
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [statsData, activityData] = await Promise.all([
      fetchAdminStats(),
      fetchRecentActivity(),
    ])
    setStats(statsData)
    setActivity(activityData)
    setLoading(false)
  }

  const refresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin'

  const kpiCards = stats ? [
    { label: 'Unread Messages', value: stats.messages.unread, total: stats.messages.total, icon: MessageSquare, color: 'var(--brand-red)', href: '/admin/messages', trend: '+' + stats.messages.unread },
    { label: 'ELPro Applications', value: stats.intern_applications.pending, total: stats.intern_applications.total, icon: Star, color: 'var(--brand-green)', href: '/admin/applications', trend: stats.intern_applications.accepted + ' accepted' },
    { label: 'Mentor Applications', value: stats.mentor_applications.pending, total: stats.mentor_applications.total, icon: Users, color: 'var(--brand-red)', href: '/admin/applications?tab=mentors', trend: stats.mentor_applications.accepted + ' accepted' },
    { label: 'Newsletter Subscribers', value: stats.newsletter.total, total: stats.newsletter.total, icon: Bell, color: 'var(--brand-green)', href: '/admin/newsletter', trend: '+' + stats.newsletter.this_month + ' this month' },
    { label: 'Blog Posts', value: stats.blog.published, total: stats.blog.total, icon: FileText, color: 'var(--brand-red)', href: '/admin/blog', trend: stats.blog.featured + ' featured' },
  ] : []

  const quickActions = [
    { label: 'New Blog Post', href: '/admin/blog', icon: Edit2, color: 'var(--brand-green)' },
    { label: 'View Messages', href: '/admin/messages', icon: MessageSquare, color: 'var(--brand-red)' },
    { label: 'ELPro Applications', href: '/admin/applications', icon: Star, color: 'var(--brand-green)' },
    { label: 'Manage Team', href: '/admin/board', icon: Shield, color: 'var(--brand-red)' },
    { label: 'Caucuses', href: '/admin/caucuses', icon: Landmark, color: 'var(--brand-green)' },
    { label: 'Events', href: '/admin/events', icon: Calendar, color: 'var(--brand-red)' },
    ...(isAdmin ? [{ label: 'Settings', href: '/admin/settings', icon: Settings, color: 'var(--brand-green)' }] : []),
    ...(isSuperAdmin ? [{ label: 'User Management', href: '/admin/users', icon: Users, color: 'var(--brand-red)' }] : []),
  ]

  return (
    <AdminLayout
      title="Dashboard"
      subtitle={`${role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Admin'} · Hesabika Trust CMS`}
      actions={
        <button onClick={refresh} disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all disabled:opacity-50"
          style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      }
    >
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="font-serif font-bold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>
          {greeting}, {displayName}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Here's what's happening with Hesabika today.
        </p>
        {isSuperAdmin && (
          <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-brand-red bg-brand-red/10 px-3 py-1 rounded-full border border-brand-red/20">
            <Shield size={11} /> Super Admin
          </span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl p-5 h-28 skeleton" />
          ))
        ) : kpiCards.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}>
            <Link to={card.href} className="block rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 group"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: card.color + '15' }}>
                <card.icon size={17} style={{ color: card.color }} />
              </div>
              <div className="font-serif font-black text-3xl mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {card.value}
              </div>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{card.label}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{card.trend}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2">
              <Activity size={16} style={{ color: 'var(--brand-green)' }} />
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
            </div>
            <Link to="/admin/messages" className="text-brand-green text-xs font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full skeleton flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 skeleton rounded w-2/3" />
                    <div className="h-2 skeleton rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : activity.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No recent activity</div>
            ) : (
              activity.map((item, i) => {
                const Icon = ACTIVITY_ICONS[item.type] || Activity
                const color = ACTIVITY_COLORS[item.type] || 'var(--brand-green)'
                return (
                  <div key={item.id + i} className="flex items-start gap-3 px-6 py-3.5 transition-colors"
                    style={{ cursor: 'default' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: color + '15' }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{item.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{timeAgo(item.time)}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
            </div>
            <div className="p-3 space-y-1">
              {quickActions.map((action) => (
                <Link key={action.label} to={action.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl transition-all group"
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: action.color + '15' }}>
                    <action.icon size={14} style={{ color: action.color }} />
                  </div>
                  <span className="text-sm font-medium flex-1" style={{ color: 'var(--text-secondary)' }}>{action.label}</span>
                  <ArrowRight size={13} style={{ color: 'var(--text-faint)' }} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* ELPro Status */}
          <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #166935, #0f4d26)' }}>
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/8" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-white" />
                <span className="font-bold text-sm">ELPro Status</span>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ['Cohort', '2026 Inaugural'],
                  ['Fellows', stats?.interns?.total ? `${stats.interns.total}+` : '23 Enrolled'],
                  ['Duration', 'Apr 2026 – Apr 2027'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-white/60">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                ))}
              </div>
              <Link to="/admin/elpro" className="mt-4 block text-center bg-white/15 hover:bg-white/25 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                Manage ELPro Fellows
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>System Status</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Supabase Database', status: 'operational' },
                { label: 'Resend Email', status: 'operational' },
                { label: 'Cloudinary CDN', status: 'operational' },
                { label: 'Vercel Hosting', status: 'operational' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-brand-green rounded-full" />
                    <span className="text-brand-green text-xs font-semibold capitalize">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}