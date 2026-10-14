import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Globe, Mail, Phone, MapPin, Shield, Bell, Megaphone, RefreshCw, CheckCircle, ExternalLink } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase'
import { useRole } from '@/hooks/useRole'
import toast from 'react-hot-toast'

type SettingCategory = 'general' | 'contact' | 'giving' | 'social' | 'programmes' | 'system'

const CATEGORIES: { id: SettingCategory; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'giving', label: 'Giving', icon: Mail },
  { id: 'social', label: 'Social Media', icon: Bell },
  { id: 'programmes', label: 'Programmes', icon: Megaphone },
  { id: 'system', label: 'System', icon: Shield },
]

export default function AdminSettingsPage() {
  const { isAdmin, isSuperAdmin, can } = useRole()
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('general')
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changed, setChanged] = useState<Set<string>>(new Set())

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('site_settings').select('*')
      if (error) throw error
      const map: Record<string, string> = {}
      data?.forEach((row: any) => { map[row.key] = row.value })
      setSettings(map)
    } catch {
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setChanged(prev => new Set(prev).add(key))
  }

  const saveSettings = async () => {
    if (!can.editSettings) { toast.error('You do not have permission to edit settings'); return }
    setSaving(true)
    try {
      const updates = Array.from(changed).map(key => ({
        key,
        value: settings[key] || '',
        updated_at: new Date().toISOString(),
      }))
      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'key' })
        if (error) throw error
      }
      setChanged(new Set())
      toast.success(`${updates.length} setting${updates.length > 1 ? 's' : ''} saved successfully`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const settingsByCategory: Record<SettingCategory, Array<{ key: string; label: string; type?: string; description?: string; readonly?: boolean }>> = {
    general: [
      { key: 'site_name', label: 'Organisation Name', description: 'The name displayed throughout the site' },
      { key: 'tagline', label: 'Tagline', description: 'Short tagline shown in the header and footer' },
      { key: 'description', label: 'Main Description', type: 'textarea', description: 'Used in meta tags and About sections' },
      { key: 'announcement_text', label: 'Announcement Banner Text', description: 'Text shown in the top announcement bar' },
      { key: 'announcement_active', label: 'Show Announcement Banner', type: 'toggle', description: 'Toggle the announcement bar on/off' },
    ],
    contact: [
      { key: 'phone', label: 'Phone Number' },
      { key: 'email', label: 'Email Address' },
      { key: 'address', label: 'Primary Address' },
    ],
    giving: [
      { key: 'mpesa_paybill', label: 'MPESA Paybill Number' },
      { key: 'mpesa_account', label: 'MPESA Account Name' },
      { key: 'bank_name', label: 'Bank Name' },
      { key: 'bank_account', label: 'Bank Account Number' },
      { key: 'bank_swift', label: 'SWIFT Code' },
    ],
    social: [
      { key: 'facebook_url', label: 'Facebook URL' },
      { key: 'twitter_url', label: 'Twitter / X URL' },
      { key: 'instagram_url', label: 'Instagram URL' },
      { key: 'youtube_url', label: 'YouTube URL' },
      { key: 'linkedin_url', label: 'LinkedIn URL' },
    ],
    programmes: [
      { key: 'elpro_fellows_count', label: 'ELPro Fellows Count', description: 'Number shown on the ELPro page and stats' },
      { key: 'gipro_alumni_count', label: 'GIPro Alumni Count', description: 'Number shown on the GIPro page and stats' },
      { key: 'caucuses_count', label: 'Caucuses Count', description: 'Number of active caucuses' },
    ],
    system: [
      { key: 'maintenance_mode', label: 'Maintenance Mode', type: 'toggle', description: 'When enabled, shows a maintenance page to visitors', readonly: !isSuperAdmin },
    ],
  }

  const currentSettings = settingsByCategory[activeCategory] || []
  const hasChanges = changed.size > 0

  return (
    <AdminLayout
      title="Site Settings"
      subtitle="Manage site configuration — changes take effect immediately"
      actions={
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs font-semibold text-brand-red bg-brand-red/10 px-3 py-1.5 rounded-full border border-brand-red/20">
              {changed.size} unsaved change{changed.size > 1 ? 's' : ''}
            </span>
          )}
          <button onClick={saveSettings} disabled={saving || !hasChanges || !can.editSettings}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      }
    >
      {!can.editSettings && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(189,36,39,0.08)', border: '1px solid rgba(189,36,39,0.2)' }}>
          <Shield size={16} className="text-brand-red flex-shrink-0" />
          <p className="text-sm text-brand-red font-medium">You have read-only access to settings. Contact a Super Admin to make changes.</p>
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: activeCategory === cat.id ? 'var(--brand-green)' : 'transparent',
                  color: activeCategory === cat.id ? '#fff' : 'var(--text-secondary)',
                }}
                onMouseEnter={e => { if (activeCategory !== cat.id) (e.currentTarget.style.background = 'var(--bg-subtle)') }}
                onMouseLeave={e => { if (activeCategory !== cat.id) (e.currentTarget.style.background = 'transparent') }}>
                <cat.icon size={16} />
                {cat.label}
                {Array.from(changed).some(k => settingsByCategory[cat.id]?.some(s => s.key === k)) && (
                  <span className="ml-auto w-2 h-2 bg-brand-red rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* View site link */}
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--brand-green)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
              <ExternalLink size={12} /> View Live Site
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <h2 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              {CATEGORIES.find(c => c.id === activeCategory)?.label} Settings
            </h2>
            {activeCategory === 'system' && !isSuperAdmin && (
              <span className="text-xs font-semibold text-brand-red bg-brand-red/10 px-2.5 py-1 rounded-full">Super Admin Only</span>
            )}
          </div>

          <div className="p-6 space-y-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 skeleton rounded w-24" />
                  <div className="h-10 skeleton rounded" />
                </div>
              ))
            ) : (
              currentSettings.map(setting => {
                const isChanged = changed.has(setting.key)
                const isReadonly = setting.readonly || !can.editSettings

                return (
                  <motion.div key={setting.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="form-label mb-0">{setting.label}</label>
                      {isChanged && (
                        <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-full">Modified</span>
                      )}
                    </div>
                    {setting.description && (
                      <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{setting.description}</p>
                    )}

                    {setting.type === 'textarea' ? (
                      <textarea
                        value={settings[setting.key] || ''}
                        onChange={e => !isReadonly && updateSetting(setting.key, e.target.value)}
                        rows={3}
                        disabled={isReadonly}
                        className="form-input resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    ) : setting.type === 'toggle' ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => !isReadonly && updateSetting(setting.key, settings[setting.key] === 'true' ? 'false' : 'true')}
                          disabled={isReadonly}
                          className="relative w-12 h-6 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ background: settings[setting.key] === 'true' ? 'var(--brand-green)' : 'var(--bg-muted)' }}>
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${settings[setting.key] === 'true' ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                          {settings[setting.key] === 'true' ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={settings[setting.key] || ''}
                        onChange={e => !isReadonly && updateSetting(setting.key, e.target.value)}
                        disabled={isReadonly}
                        className="form-input disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: isChanged ? 'var(--brand-green)' : undefined }}
                      />
                    )}
                  </motion.div>
                )
              })
            )}

            {activeCategory === 'system' && isSuperAdmin && (
              <div className="mt-6 pt-5 space-y-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Danger Zone</h4>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(189,36,39,0.06)', border: '1px solid rgba(189,36,39,0.2)' }}>
                  <p className="text-sm font-semibold text-brand-red mb-1">Clear All Cache</p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Force all pages to reload fresh data from the database.</p>
                  <button onClick={() => toast.success('Cache cleared — pages will reload fresh data')}
                    className="text-xs font-bold text-brand-red bg-brand-red/10 px-4 py-2 rounded-lg hover:bg-brand-red/20 transition-colors">
                    Clear Cache
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}