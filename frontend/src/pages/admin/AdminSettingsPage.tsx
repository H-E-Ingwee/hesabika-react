import { useState } from 'react'
import { Save, Globe, Mail, Phone, MapPin, Shield, Bell, Palette } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { SITE_CONFIG } from '@/lib/data'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'security'>('general')
  const [saving, setSaving] = useState(false)

  const [general, setGeneral] = useState({
    name: SITE_CONFIG.name,
    tagline: SITE_CONFIG.tagline,
    description: SITE_CONFIG.description,
    focus_description: SITE_CONFIG.focus_description,
  })

  const [contact, setContact] = useState({
    phone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: SITE_CONFIG.address,
    address2: SITE_CONFIG.address2,
    mpesa_paybill: SITE_CONFIG.mpesa_paybill,
    mpesa_account: SITE_CONFIG.mpesa_account,
    bank_name: SITE_CONFIG.bank_name,
    bank_account_name: SITE_CONFIG.bank_account_name,
    bank_account_number: SITE_CONFIG.bank_account_number,
    bank_swift: SITE_CONFIG.bank_swift,
  })

  const [social, setSocial] = useState({ ...SITE_CONFIG.social })

  const save = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Settings saved! Update data.ts to persist changes.')
    setSaving(false)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contact & Giving', icon: Phone },
    { id: 'social', label: 'Social Media', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <AdminLayout title="Settings" subtitle="Manage site configuration">
      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-brand-green text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">{tabs.find(t => t.id === activeTab)?.label} Settings</h2>
            <button onClick={save} disabled={saving} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2 disabled:opacity-60">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          <div className="p-6 space-y-5">
            {activeTab === 'general' && (
              <>
                <div>
                  <label className="form-label">Organisation Name</label>
                  <input value={general.name} onChange={e => setGeneral({ ...general, name: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Tagline</label>
                  <input value={general.tagline} onChange={e => setGeneral({ ...general, tagline: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Main Description</label>
                  <textarea value={general.description} onChange={e => setGeneral({ ...general, description: e.target.value })} rows={3} className="form-input resize-none" />
                </div>
                <div>
                  <label className="form-label">FOCUS Kenya Description</label>
                  <textarea value={general.focus_description} onChange={e => setGeneral({ ...general, focus_description: e.target.value })} rows={3} className="form-input resize-none" />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800 text-xs font-semibold mb-1">⚠️ Note</p>
                  <p className="text-yellow-700 text-xs">Settings saved here are for reference. To permanently update site content, edit <code className="bg-yellow-100 px-1 rounded">frontend/src/lib/data.ts</code> and redeploy.</p>
                </div>
              </>
            )}

            {activeTab === 'contact' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} className="form-input" />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} className="form-input" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Primary Address</label>
                  <input value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Secondary Address</label>
                  <input value={contact.address2} onChange={e => setContact({ ...contact, address2: e.target.value })} className="form-input" />
                </div>
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">MPESA Giving</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Paybill Number</label>
                      <input value={contact.mpesa_paybill} onChange={e => setContact({ ...contact, mpesa_paybill: e.target.value })} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Account Number</label>
                      <input value={contact.mpesa_account} onChange={e => setContact({ ...contact, mpesa_account: e.target.value })} className="form-input" />
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">Bank Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Bank Name</label>
                      <input value={contact.bank_name} onChange={e => setContact({ ...contact, bank_name: e.target.value })} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Account Name</label>
                      <input value={contact.bank_account_name} onChange={e => setContact({ ...contact, bank_account_name: e.target.value })} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">Account Number</label>
                      <input value={contact.bank_account_number} onChange={e => setContact({ ...contact, bank_account_number: e.target.value })} className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">SWIFT Code</label>
                      <input value={contact.bank_swift} onChange={e => setContact({ ...contact, bank_swift: e.target.value })} className="form-input" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'social' && (
              <>
                <p className="text-gray-500 text-sm">Update your social media profile URLs.</p>
                {Object.entries(social).map(([platform, url]) => (
                  <div key={platform}>
                    <label className="form-label capitalize">{platform}</label>
                    <input value={url} onChange={e => setSocial({ ...social, [platform]: e.target.value })} placeholder={`https://${platform}.com/HesabikaTrust`} className="form-input" />
                  </div>
                ))}
              </>
            )}

            {activeTab === 'security' && (
              <div className="space-y-5">
                <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-5">
                  <h3 className="font-bold text-brand-green text-sm mb-2 flex items-center gap-2"><Shield size={16} /> Authentication</h3>
                  <p className="text-gray-600 text-sm">Authentication is handled by Supabase Auth. To manage admin users, go to your Supabase dashboard → Authentication → Users.</p>
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-green text-sm font-semibold mt-3 hover:underline">
                    Open Supabase Dashboard →
                  </a>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-2">Row Level Security</h3>
                  <p className="text-gray-600 text-sm">All database tables have RLS enabled. Public users can only read published content and submit forms. Admin operations require authentication.</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-2">Environment Variables</h3>
                  <p className="text-gray-600 text-sm mb-3">Sensitive keys are stored as Vercel environment variables — never in code.</p>
                  <div className="space-y-1.5 font-mono text-xs">
                    {['SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'RESEND_API_KEY', 'CLOUDINARY_API_SECRET'].map(key => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-brand-green rounded-full" />
                        <span className="text-gray-600">{key}</span>
                        <span className="text-gray-400">= ••••••••</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}