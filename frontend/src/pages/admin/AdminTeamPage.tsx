import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Upload } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { BOARD_MEMBERS, SECRETARIAT, GIPRO_INTERNS } from '@/lib/data'

type TeamType = 'board' | 'secretariat' | 'interns' | 'elpro'

const tableMap: Record<TeamType, string> = {
  board: 'board_members',
  secretariat: 'board_members',
  interns: 'gipro_interns',
  elpro: 'gipro_interns',
}

const staticData: Record<TeamType, any[]> = {
  board: BOARD_MEMBERS,
  secretariat: SECRETARIAT,
  interns: GIPRO_INTERNS,
  elpro: [],
}

export default function AdminTeamPage({ type = 'board' }: { type?: TeamType }) {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', role: '', bio: '', image_url: '', cohort: '', placement: '', order_index: 0 })

  const titles: Record<TeamType, string> = {
    board: 'Board of Trustees',
    secretariat: 'Secretariat',
    interns: 'GIPro Alumni',
    elpro: 'ELPro Fellows',
  }

  useEffect(() => { fetchMembers() }, [type])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const table = tableMap[type]
      const { data, error } = await supabase.from(table).select('*').order('order_index', { ascending: true })
      if (error || !data || data.length === 0) {
        setMembers(staticData[type])
      } else {
        setMembers(data)
      }
    } catch {
      setMembers(staticData[type])
    } finally {
      setLoading(false)
    }
  }

  const openForm = (member?: any) => {
    if (member) {
      setEditing(member)
      setForm({ name: member.name || '', role: member.role || '', bio: member.bio || '', image_url: member.image_url || '', cohort: member.cohort || '', placement: member.placement || '', order_index: member.order_index || 0 })
    } else {
      setEditing(null)
      setForm({ name: '', role: '', bio: '', image_url: '', cohort: '', placement: '', order_index: members.length })
    }
    setShowForm(true)
  }

  const saveMember = async () => {
    try {
      const table = tableMap[type]
      const payload = type === 'interns' || type === 'elpro'
        ? { name: form.name, slug: form.name.toLowerCase().replace(/\s+/g, '-'), cohort: form.cohort, placement: form.placement, image_url: form.image_url, order_index: form.order_index }
        : { name: form.name, role: form.role, bio: form.bio, image_url: form.image_url, order_index: form.order_index }

      if (editing) {
        const { error } = await supabase.from(table).update(payload).eq('id', editing.id)
        if (error) throw error
        toast.success('Member updated!')
      } else {
        const { error } = await supabase.from(table).insert([payload])
        if (error) throw error
        toast.success('Member added!')
      }
      setShowForm(false)
      fetchMembers()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
    }
  }

  const deleteMember = async (id: string) => {
    if (!confirm('Remove this member?')) return
    try {
      await supabase.from(tableMap[type]).delete().eq('id', id)
      setMembers(members.filter(m => m.id !== id))
      toast.success('Member removed')
    } catch { toast.error('Failed to remove') }
  }

  const filtered = members.filter(m =>
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.role || m.cohort || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout
      title={titles[type]}
      subtitle={`${members.length} members`}
      actions={
        <button onClick={() => openForm()} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
          <Plus size={15} /> Add Member
        </button>
      }
    >
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Member' : 'Add Member'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="form-label">Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="form-input" />
              </div>
              {(type === 'board' || type === 'secretariat') && (
                <>
                  <div>
                    <label className="form-label">Role / Title</label>
                    <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Chairperson, Board of Trustees" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Bio</label>
                    <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Brief biography..." className="form-input resize-none" />
                  </div>
                </>
              )}
              {(type === 'interns' || type === 'elpro') && (
                <>
                  <div>
                    <label className="form-label">Cohort Year</label>
                    <input value={form.cohort} onChange={e => setForm({ ...form, cohort: e.target.value })} placeholder="e.g. 2021, 2022, 2026" className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Placement / Institution</label>
                    <input value={form.placement} onChange={e => setForm({ ...form, placement: e.target.value })} placeholder="e.g. Ministry of Finance" className="form-input" />
                  </div>
                </>
              )}
              <div>
                <label className="form-label">Photo URL</label>
                <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="/images/photo.jpg or Cloudinary URL" className="form-input" />
              </div>
              <div>
                <label className="form-label">Order Index</label>
                <input type="number" value={form.order_index} onChange={e => setForm({ ...form, order_index: +e.target.value })} className="form-input" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={saveMember} className="btn-secondary flex-1 justify-center">Save</button>
              <button onClick={() => setShowForm(false)} className="btn-outline-red px-6">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." className="form-input pl-9" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : filtered.map((member) => (
          <motion.div key={member.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={member.image_url || member.image || '/images/board-Hesabika-Noimg.jpg'}
                alt={member.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-400"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/board-Hesabika-Noimg.jpg' }}
              />
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => openForm(member)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-brand-green hover:text-white transition-colors">
                  <Edit size={14} />
                </button>
                <button onClick={() => deleteMember(member.id)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-brand-red hover:text-white transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="font-bold text-gray-900 text-xs leading-tight mb-0.5">{member.name}</p>
              <p className="text-brand-green text-[10px] font-bold uppercase tracking-wider truncate">
                {member.role || member.cohort || ''}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Add new card */}
        <button onClick={() => openForm()} className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand-green hover:text-brand-green transition-all duration-200 bg-white">
          <Plus size={24} />
          <span className="text-xs font-semibold">Add Member</span>
        </button>
      </div>
    </AdminLayout>
  )
}

// Separate page exports for each team type
export function AdminBoardPage() { return <AdminTeamPage type="board" /> }
export function AdminSecretariatAdminPage() { return <AdminTeamPage type="secretariat" /> }
export function AdminInternsAdminPage() { return <AdminTeamPage type="interns" /> }
export function AdminElproFellowsPage() { return <AdminTeamPage type="elpro" /> }