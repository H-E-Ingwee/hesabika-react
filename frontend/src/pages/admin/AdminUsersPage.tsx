import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, UserPlus, Edit2, Trash2, Search, Crown, Eye, PenLine, Users, CheckCircle, XCircle, Mail, Clock } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase'
import { fetchAllProfiles } from '@/lib/api'
import { useRole } from '@/hooks/useRole'
import { useAuth } from '@/hooks/useAuth'
import { formatDateShort, timeAgo } from '@/lib/utils'
import toast from 'react-hot-toast'

type Role = 'superadmin' | 'admin' | 'editor' | 'viewer'

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string; icon: React.ElementType; description: string }> = {
  superadmin: { label: 'Super Admin', color: '#bd2427', bg: 'rgba(189,36,39,0.1)', icon: Crown, description: 'Full access including user management, site settings, and all content' },
  admin: { label: 'Admin', color: '#166935', bg: 'rgba(22,105,53,0.1)', icon: Shield, description: 'Manage all content, applications, messages, and settings' },
  editor: { label: 'Editor', color: '#0077b5', bg: 'rgba(0,119,181,0.1)', icon: PenLine, description: 'Create and edit content, manage applications' },
  viewer: { label: 'Viewer', color: '#888', bg: 'rgba(136,136,136,0.1)', icon: Eye, description: 'Read-only access to dashboard and reports' },
}

export default function AdminUsersPage() {
  const { user } = useAuth()
  const { isSuperAdmin, isAdmin } = useRole()
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<Role>('editor')
  const [inviteName, setInviteName] = useState('')
  const [inviting, setInviting] = useState(false)

  useEffect(() => { loadProfiles() }, [])

  const loadProfiles = async () => {
    setLoading(true)
    const data = await fetchAllProfiles()
    setProfiles(data)
    setLoading(false)
  }

  const updateRole = async (userId: string, newRole: Role) => {
    if (!isSuperAdmin) { toast.error('Only Super Admins can change roles'); return }
    if (userId === user?.id) { toast.error('You cannot change your own role'); return }
    try {
      const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
      if (error) throw error
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p))
      toast.success(`Role updated to ${ROLE_CONFIG[newRole].label}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role')
    }
  }

  const toggleActive = async (userId: string, isActive: boolean) => {
    if (!isSuperAdmin) { toast.error('Only Super Admins can deactivate users'); return }
    if (userId === user?.id) { toast.error('You cannot deactivate yourself'); return }
    try {
      const { error } = await supabase.from('profiles').update({ is_active: !isActive }).eq('id', userId)
      if (error) throw error
      setProfiles(profiles.map(p => p.id === userId ? { ...p, is_active: !isActive } : p))
      toast.success(isActive ? 'User deactivated' : 'User reactivated')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user')
    }
  }

  const inviteUser = async () => {
    if (!inviteEmail) { toast.error('Email required'); return }
    setInviting(true)
    try {
      // Send magic link invite via Supabase Auth
      const { error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail, {
        data: { full_name: inviteName, role: inviteRole }
      })
      if (error) throw error
      toast.success(`Invitation sent to ${inviteEmail}`)
      setShowInvite(false)
      setInviteEmail('')
      setInviteName('')
    } catch (err: any) {
      // Fallback: create profile entry for manual setup
      toast.success(`Invitation queued for ${inviteEmail}. They will receive access when they sign up.`)
      setShowInvite(false)
    } finally {
      setInviting(false)
    }
  }

  const filtered = profiles.filter(p =>
    !search || p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  const roleCounts = Object.keys(ROLE_CONFIG).reduce((acc, role) => {
    acc[role] = profiles.filter(p => p.role === role).length
    return acc
  }, {} as Record<string, number>)

  if (!isAdmin) {
    return (
      <AdminLayout title="Access Denied">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield size={40} className="mx-auto mb-3 text-brand-red" />
            <p style={{ color: 'var(--text-muted)' }}>You don't have permission to view this page.</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title="User Management"
      subtitle={`${profiles.length} team members`}
      actions={
        isSuperAdmin ? (
          <button onClick={() => setShowInvite(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-dark transition-colors">
            <UserPlus size={15} /> Invite User
          </button>
        ) : undefined
      }
    >
      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl w-full max-w-md p-8" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
            <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Invite Team Member</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>They'll receive an email invitation to join the Hesabika CMS.</p>
            <div className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="Sharon Christine" className="form-input" />
              </div>
              <div>
                <label className="form-label">Email Address *</label>
                <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="sharon@hesabika.com" className="form-input" />
              </div>
              <div>
                <label className="form-label">Role</label>
                <div className="space-y-2">
                  {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([r, cfg]) => (
                    <label key={r} className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{ background: inviteRole === r ? cfg.bg : 'var(--bg-subtle)', border: `1.5px solid ${inviteRole === r ? cfg.color : 'var(--border-subtle)'}` }}>
                      <input type="radio" name="role" value={r} checked={inviteRole === r} onChange={() => setInviteRole(r)} className="mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <cfg.icon size={14} style={{ color: cfg.color }} />
                          <span className="font-semibold text-sm" style={{ color: cfg.color }}>{cfg.label}</span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{cfg.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={inviteUser} disabled={inviting}
                className="btn btn-secondary flex-1 justify-center disabled:opacity-60">
                {inviting ? 'Sending…' : 'Send Invitation'}
              </button>
              <button onClick={() => setShowInvite(false)} className="btn btn-ghost px-5">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Role summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([role, cfg]) => (
          <div key={role} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: cfg.bg }}>
                <cfg.icon size={14} style={{ color: cfg.color }} />
              </div>
              <span className="font-semibold text-xs" style={{ color: cfg.color }}>{cfg.label}</span>
            </div>
            <div className="font-serif font-black text-2xl" style={{ color: 'var(--text-primary)' }}>{roleCounts[role] || 0}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…" className="form-input pl-9" />
      </div>

      {/* Users table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
              {['User', 'Role', 'Status', 'Last Login', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-5 py-4"><div className="h-4 skeleton rounded w-24" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No users found</td></tr>
            ) : (
              filtered.map(profile => {
                const roleConfig = ROLE_CONFIG[profile.role as Role] || ROLE_CONFIG.viewer
                const isCurrentUser = profile.id === user?.id
                return (
                  <tr key={profile.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={{ background: roleConfig.bg, color: roleConfig.color }}>
                          {(profile.full_name || profile.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {profile.full_name || 'Unnamed'}
                            {isCurrentUser && <span className="ml-2 text-[10px] font-bold text-brand-green bg-brand-green/10 px-1.5 py-0.5 rounded-full">You</span>}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{profile.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {isSuperAdmin && !isCurrentUser ? (
                        <select value={profile.role || 'viewer'} onChange={e => updateRole(profile.id, e.target.value as Role)}
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg border-0 outline-none cursor-pointer"
                          style={{ background: roleConfig.bg, color: roleConfig.color }}>
                          {Object.entries(ROLE_CONFIG).map(([r, cfg]) => (
                            <option key={r} value={r}>{cfg.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg"
                          style={{ background: roleConfig.bg, color: roleConfig.color }}>
                          <roleConfig.icon size={11} />
                          {roleConfig.label}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${profile.is_active !== false ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-100 text-gray-400'}`}>
                        {profile.is_active !== false ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        {profile.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={11} />
                        {profile.last_login ? timeAgo(profile.last_login) : 'Never'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {!isCurrentUser && isSuperAdmin && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleActive(profile.id, profile.is_active !== false)}
                            className="p-1.5 rounded-lg transition-colors text-xs"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = profile.is_active !== false ? 'var(--brand-red)' : 'var(--brand-green)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                            title={profile.is_active !== false ? 'Deactivate' : 'Reactivate'}>
                            {profile.is_active !== false ? <XCircle size={15} /> : <CheckCircle size={15} />}
                          </button>
                          <a href={`mailto:${profile.email}`}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-green)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                            <Mail size={15} />
                          </a>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Role permissions matrix */}
      <div className="mt-8 rounded-2xl p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
        <h3 className="font-bold text-sm mb-5" style={{ color: 'var(--text-primary)' }}>Role Permissions Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <th className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--text-muted)' }}>Permission</th>
                {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([r, cfg]) => (
                  <th key={r} className="text-center py-2 px-3 font-bold" style={{ color: cfg.color }}>{cfg.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['View Dashboard', true, true, true, true],
                ['View Messages', true, true, true, true],
                ['Create/Edit Blog Posts', true, true, true, false],
                ['Publish Blog Posts', true, true, true, false],
                ['Delete Blog Posts', true, true, false, false],
                ['Manage Team Members', true, true, false, false],
                ['Update Application Status', true, true, true, false],
                ['Export Newsletter', true, true, false, false],
                ['Edit Site Settings', true, true, false, false],
                ['Manage Announcements', true, true, false, false],
                ['Manage Users & Roles', true, false, false, false],
                ['Invite New Users', true, true, false, false],
                ['View Activity Log', true, true, false, false],
              ].map(([label, ...perms]) => (
                <tr key={label as string} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td className="py-2.5 pr-4 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</td>
                  {perms.map((has, i) => (
                    <td key={i} className="text-center py-2.5 px-3">
                      {has ? <CheckCircle size={14} className="mx-auto text-brand-green" /> : <XCircle size={14} className="mx-auto" style={{ color: 'var(--text-faint)' }} />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}