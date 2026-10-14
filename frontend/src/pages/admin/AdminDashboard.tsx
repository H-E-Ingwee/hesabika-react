import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare, Users, BookOpen, Bell, FileText, Star, TrendingUp, Eye, ArrowRight, CheckCircle, Clock } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { formatDateShort } from '@/lib/utils'

interface Stats {
  messages: { total: number; unread: number }
  intern_applications: { total: number; pending: number }
  mentor_applications: { total: number; pending: number }
  newsletter_subscribers: number
  blog_posts: { total: number; published: number }
  recent_messages: any[]
}

const statCards = (stats: Stats) => [
  { label: 'Unread Messages', value: stats.messages.unread, total: stats.messages.total, icon: MessageSquare, color: 'bg-brand-red', href: '/admin/messages' },
  { label: 'ELPro Applications', value: stats.intern_applications.pending, total: stats.intern_applications.total, icon: Star, color: 'bg-brand-green', href: '/admin/applications' },
  { label: 'Mentor Applications', value: stats.mentor_applications.pending, total: stats.mentor_applications.total, icon: Users, color: 'bg-brand-red', href: '/admin/applications?tab=mentors' },
  { label: 'Newsletter Subscribers', value: stats.newsletter_subscribers, total: stats.newsletter_subscribers, icon: Bell, color: 'bg-brand-green', href: '/admin/newsletter' },
  { label: 'Blog Posts', value: stats.blog_posts.published, total: stats.blog_posts.total, icon: FileText, color: 'bg-brand-red', href: '/admin/blog' },
]

const quickActions = [
  { label: 'New Blog Post', href: '/admin/blog/new', icon: FileText, color: 'bg-brand-green' },
  { label: 'View Messages', href: '/admin/messages', icon: MessageSquare, color: 'bg-brand-red' },
  { label: 'ELPro Applications', href: '/admin/applications', icon: Star, color: 'bg-brand-green' },
  { label: 'Manage Team', href: '/admin/board', icon: Users, color: 'bg-brand-red' },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    messages: { total: 0, unread: 0 },
    intern_applications: { total: 0, pending: 0 },
    mentor_applications: { total: 0, pending: 0 },
    newsletter_subscribers: 0,
    blog_posts: { total: 0, published: 0 },
    recent_messages: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [messages, internApps, mentorApps, subscribers, posts] = await Promise.all([
        supabase.from('contact_messages').select('id, read, created_at, first_name, last_name, subject').order('created_at', { ascending: false }),
        supabase.from('intern_applications').select('id, status, created_at'),
        supabase.from('mentor_applications').select('id, status, created_at'),
        supabase.from('newsletter_subscribers').select('id').eq('active', true),
        supabase.from('blog_posts').select('id, published, created_at'),
      ])

      setStats({
        messages: {
          total: messages.data?.length || 0,
          unread: messages.data?.filter(m => !m.read).length || 0,
        },
        intern_applications: {
          total: internApps.data?.length || 0,
          pending: internApps.data?.filter(a => a.status === 'pending').length || 0,
        },
        mentor_applications: {
          total: mentorApps.data?.length || 0,
          pending: mentorApps.data?.filter(a => a.status === 'pending').length || 0,
        },
        newsletter_subscribers: subscribers.data?.length || 0,
        blog_posts: {
          total: posts.data?.length || 0,
          published: posts.data?.filter(p => p.published).length || 0,
        },
        recent_messages: messages.data?.slice(0, 5) || [],
      })
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <AdminLayout title="Dashboard" subtitle="Hesabika Trust CMS">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="font-serif font-bold text-2xl text-gray-900 mb-1">
          {greeting}, {user?.email?.split('@')[0]} 👋
        </h2>
        <p className="text-gray-500 text-sm">Here's what's happening with Hesabika today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards(stats).map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
          >
            <Link to={card.href} className="block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon size={18} className="text-white" />
              </div>
              <div className="font-serif font-black text-3xl text-gray-900 mb-0.5">
                {loading ? <span className="w-8 h-6 bg-gray-100 rounded animate-pulse block" /> : card.value}
              </div>
              <p className="text-gray-500 text-xs font-semibold">{card.label}</p>
              {card.total !== card.value && (
                <p className="text-gray-400 text-xs mt-0.5">{card.total} total</p>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Recent Messages</h3>
            <Link to="/admin/messages" className="text-brand-green text-xs font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex gap-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-2 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : stats.recent_messages.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">No messages yet</div>
            ) : (
              stats.recent_messages.map((msg: any) => (
                <Link key={msg.id} to="/admin/messages" className="flex items-start gap-3 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs text-white ${msg.read ? 'bg-gray-300' : 'bg-brand-red'}`}>
                    {msg.first_name?.[0]}{msg.last_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm truncate">{msg.first_name} {msg.last_name}</p>
                      {!msg.read && <span className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-gray-500 text-xs truncate">{msg.subject}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{formatDateShort(msg.created_at)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions + Status */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <action.icon size={15} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{action.label}</span>
                  <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">System Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Supabase Database', status: 'operational' },
                { label: 'Resend Email', status: 'operational' },
                { label: 'Cloudinary CDN', status: 'operational' },
                { label: 'Vercel Hosting', status: 'operational' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-brand-green rounded-full" />
                    <span className="text-brand-green text-xs font-semibold capitalize">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ELPro Status */}
          <div className="bg-brand-green rounded-2xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} />
              <span className="font-bold text-sm">ELPro Status</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Cohort</span>
                <span className="font-semibold">2026 Inaugural</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Fellows</span>
                <span className="font-semibold">23 Enrolled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Duration</span>
                <span className="font-semibold">Apr 2026 – Apr 2027</span>
              </div>
            </div>
            <Link to="/admin/elpro" className="mt-4 block text-center bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 rounded-lg transition-colors">
              Manage ELPro →
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}