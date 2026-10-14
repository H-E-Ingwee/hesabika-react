import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, XCircle, Clock, Eye, Star, Users } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase'
import { formatDateShort } from '@/lib/utils'
import toast from 'react-hot-toast'

type InternApp = {
  id: string; first_name: string; last_name: string; email: string; phone: string
  university: string; course: string; motivation: string; status: string; created_at: string
}
type MentorApp = {
  id: string; full_name: string; email: string; phone: string
  profession: string; organization: string; years_experience: string; motivation: string; status: string; created_at: string
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  reviewing: { label: 'Reviewing', color: 'bg-blue-100 text-blue-700', icon: Eye },
  accepted: { label: 'Accepted', color: 'bg-brand-green/10 text-brand-green', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-brand-red/10 text-brand-red', icon: XCircle },
}

export default function AdminApplicationsPage() {
  const [tab, setTab] = useState<'elpro' | 'mentors'>('elpro')
  const [internApps, setInternApps] = useState<InternApp[]>([])
  const [mentorApps, setMentorApps] = useState<MentorApp[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [interns, mentors] = await Promise.all([
        supabase.from('intern_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('mentor_applications').select('*').order('created_at', { ascending: false }),
      ])
      setInternApps(interns.data || [])
      setMentorApps(mentors.data || [])
    } catch { toast.error('Failed to load applications') }
    finally { setLoading(false) }
  }

  const updateStatus = async (id: string, status: string, type: 'intern' | 'mentor') => {
    try {
      const table = type === 'intern' ? 'intern_applications' : 'mentor_applications'
      await supabase.from(table).update({ status }).eq('id', id)
      if (type === 'intern') setInternApps(internApps.map(a => a.id === id ? { ...a, status } : a))
      else setMentorApps(mentorApps.map(a => a.id === id ? { ...a, status } : a))
      if (selected?.id === id) setSelected({ ...selected, status })
      toast.success(`Status updated to ${status}`)
    } catch { toast.error('Failed to update status') }
  }

  const apps = tab === 'elpro' ? internApps : mentorApps
  const filtered = apps.filter((a: any) => {
    const name = tab === 'elpro' ? `${(a as InternApp).first_name} ${(a as InternApp).last_name}` : (a as MentorApp).full_name
    const matchSearch = `${name} ${a.email}`.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    pending: apps.filter((a: any) => a.status === 'pending').length,
    reviewing: apps.filter((a: any) => a.status === 'reviewing').length,
    accepted: apps.filter((a: any) => a.status === 'accepted').length,
    rejected: apps.filter((a: any) => a.status === 'rejected').length,
  }

  return (
    <AdminLayout title="Applications" subtitle={`${internApps.length} ELPro · ${mentorApps.length} Mentor applications`}>
      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab('elpro')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${tab === 'elpro' ? 'bg-brand-green border-brand-green text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-green'}`}>
          <Star size={15} /> ELPro Applications ({internApps.length})
        </button>
        <button onClick={() => setTab('mentors')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${tab === 'mentors' ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-red'}`}>
          <Users size={15} /> Mentor Applications ({mentorApps.length})
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {Object.entries(counts).map(([status, count]) => {
          const cfg = statusConfig[status as keyof typeof statusConfig]
          return (
            <button key={status} onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
              className={`bg-white rounded-xl p-4 border-2 transition-all text-left ${statusFilter === status ? 'border-brand-green' : 'border-gray-100'} shadow-sm hover:shadow-md`}>
              <div className="font-serif font-black text-2xl text-gray-900 mb-0.5">{count}</div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
            </button>
          )
        })}
      </div>

      <div className="flex gap-5">
        {/* List */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applications..." className="form-input pl-9 text-sm py-2" />
            </div>
          </div>
          <div className="divide-y divide-gray-50 max-h-[60vh] overflow-y-auto">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-sm">No applications found</div>
            ) : (
              filtered.map((app: any) => {
                const name = tab === 'elpro' ? `${app.first_name} ${app.last_name}` : app.full_name
                const cfg = statusConfig[app.status as keyof typeof statusConfig] || statusConfig.pending
                return (
                  <button key={app.id} onClick={() => setSelected(app)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex gap-3 ${selected?.id === app.id ? 'bg-brand-green/5 border-l-2 border-brand-green' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-bold text-xs flex-shrink-0">
                      {name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 text-sm truncate">{name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{app.email}</p>
                      <p className="text-xs text-gray-400">{formatDateShort(app.created_at)}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Detail */}
        {selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-96 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-shrink-0">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">
                {tab === 'elpro' ? `${selected.first_name} ${selected.last_name}` : selected.full_name}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">{selected.email} · {selected.phone}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {tab === 'elpro' ? (
                <>
                  <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">University</p><p className="text-sm text-gray-700">{selected.university || '—'}</p></div>
                  <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Course</p><p className="text-sm text-gray-700">{selected.course || '—'}</p></div>
                </>
              ) : (
                <>
                  <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Profession</p><p className="text-sm text-gray-700">{selected.profession || '—'}</p></div>
                  <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Organization</p><p className="text-sm text-gray-700">{selected.organization || '—'}</p></div>
                  <div><p className="text-xs font-bold text-gray-400 uppercase mb-1">Experience</p><p className="text-sm text-gray-700">{selected.years_experience || '—'}</p></div>
                </>
              )}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Motivation</p>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl">{selected.motivation}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(statusConfig).map(([status, cfg]) => (
                    <button key={status} onClick={() => updateStatus(selected.id, status, tab === 'elpro' ? 'intern' : 'mentor')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border-2 ${selected.status === status ? `${cfg.color} border-current` : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                      {cfg.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100">
              <a href={`mailto:${selected.email}`} className="btn-secondary w-full justify-center text-sm py-2.5">
                Reply via Email
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  )
}