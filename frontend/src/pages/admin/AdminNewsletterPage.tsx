import { useState, useEffect } from 'react'
import { Search, Download, UserX, Bell } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase'
import { formatDateShort } from '@/lib/utils'
import toast from 'react-hot-toast'

type Subscriber = {
  id: string; email: string; name: string; active: boolean; created_at: string
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active')

  useEffect(() => { fetchSubscribers() }, [])

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setSubscribers(data || [])
    } catch { toast.error('Failed to load subscribers') }
    finally { setLoading(false) }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await supabase.from('newsletter_subscribers').update({ active: !active }).eq('id', id)
      setSubscribers(subscribers.map(s => s.id === id ? { ...s, active: !active } : s))
      toast.success(active ? 'Subscriber deactivated' : 'Subscriber reactivated')
    } catch { toast.error('Failed to update') }
  }

  const exportCSV = () => {
    const active = subscribers.filter(s => s.active)
    const csv = ['Email,Name,Subscribed'].concat(active.map(s => `${s.email},${s.name || ''},${formatDateShort(s.created_at)}`)).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'hesabika-subscribers.csv'; a.click()
    toast.success(`Exported ${active.length} subscribers`)
  }

  const filtered = subscribers.filter(s => {
    const matchSearch = `${s.email} ${s.name}`.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'active' ? s.active : !s.active)
    return matchSearch && matchFilter
  })

  const activeCount = subscribers.filter(s => s.active).length

  return (
    <AdminLayout
      title="Newsletter Subscribers"
      subtitle={`${activeCount} active · ${subscribers.length} total`}
      actions={
        <button onClick={exportCSV} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
          <Download size={15} /> Export CSV
        </button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Subscribers', value: activeCount, color: 'bg-brand-green' },
          { label: 'Total Subscribers', value: subscribers.length, color: 'bg-brand-red' },
          { label: 'Unsubscribed', value: subscribers.length - activeCount, color: 'bg-gray-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-8 h-8 ${stat.color} rounded-lg mb-3`} />
            <div className="font-serif font-black text-3xl text-gray-900 mb-0.5">{stat.value}</div>
            <p className="text-gray-500 text-xs font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers..." className="form-input pl-9" />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${filter === f ? 'bg-brand-green border-brand-green text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-green'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Name</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Subscribed</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-3"><div className="h-3 bg-gray-100 rounded w-48" /></td>
                  <td className="px-5 py-3 hidden md:table-cell"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                  <td className="px-5 py-3 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                  <td className="px-5 py-3"><div className="h-5 bg-gray-100 rounded-full w-14" /></td>
                  <td className="px-5 py-3"><div className="h-5 bg-gray-100 rounded w-16 ml-auto" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400 text-sm">No subscribers found</td></tr>
            ) : (
              filtered.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-bold text-xs flex-shrink-0">
                        {sub.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-900">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-500 text-sm">{sub.name || '—'}</td>
                  <td className="px-5 py-3 hidden lg:table-cell text-gray-400 text-xs">{formatDateShort(sub.created_at)}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sub.active ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-100 text-gray-400'}`}>
                      {sub.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => toggleActive(sub.id, sub.active)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-red hover:bg-brand-red/8 transition-colors" title={sub.active ? 'Deactivate' : 'Reactivate'}>
                      <UserX size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}