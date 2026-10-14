import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Mail, MailOpen, Trash2, Reply, Filter } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

type Message = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [selected, setSelected] = useState<Message | null>(null)

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setMessages(data || [])
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }

  const markRead = async (id: string, read: boolean) => {
    try {
      await supabase.from('contact_messages').update({ read }).eq('id', id)
      setMessages(messages.map(m => m.id === id ? { ...m, read } : m))
      if (selected?.id === id) setSelected({ ...selected, read })
    } catch { toast.error('Failed to update') }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return
    try {
      await supabase.from('contact_messages').delete().eq('id', id)
      setMessages(messages.filter(m => m.id !== id))
      if (selected?.id === id) setSelected(null)
      toast.success('Message deleted')
    } catch { toast.error('Failed to delete') }
  }

  const openMessage = (msg: Message) => {
    setSelected(msg)
    if (!msg.read) markRead(msg.id, true)
  }

  const filtered = messages.filter(m => {
    const matchSearch = `${m.first_name} ${m.last_name} ${m.email} ${m.subject}`.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'unread' ? !m.read : m.read)
    return matchSearch && matchFilter
  })

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <AdminLayout
      title="Messages"
      subtitle={`${unreadCount} unread · ${messages.length} total`}
    >
      <div className="flex gap-5 h-[calc(100vh-180px)]">
        {/* Message List */}
        <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
          {/* Search + Filter */}
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="form-input pl-9 text-sm py-2" />
            </div>
            <div className="flex gap-1.5">
              {(['all', 'unread', 'read'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === 'unread' && unreadCount > 0 && <span className="ml-1 bg-brand-red text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-2 bg-gray-100 rounded w-3/4" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No messages found</div>
            ) : (
              filtered.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex gap-3 ${selected?.id === msg.id ? 'bg-brand-green/5 border-l-2 border-brand-green' : ''}`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white ${msg.read ? 'bg-gray-300' : 'bg-brand-red'}`}>
                    {msg.first_name[0]}{msg.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-sm truncate ${msg.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                        {msg.first_name} {msg.last_name}
                      </span>
                      {!msg.read && <span className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(msg.created_at)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hidden lg:flex flex-col">
          {selected ? (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selected.subject}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{selected.first_name} {selected.last_name}</span>
                    <span>·</span>
                    <a href={`mailto:${selected.email}`} className="text-brand-green hover:underline">{selected.email}</a>
                    {selected.phone && <><span>·</span><span>{selected.phone}</span></>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(selected.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => markRead(selected.id, !selected.read)} className="p-2 rounded-lg text-gray-400 hover:text-brand-green hover:bg-brand-green/8 transition-colors" title={selected.read ? 'Mark unread' : 'Mark read'}>
                    {selected.read ? <Mail size={16} /> : <MailOpen size={16} />}
                  </button>
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="p-2 rounded-lg text-gray-400 hover:text-brand-green hover:bg-brand-green/8 transition-colors">
                    <Reply size={16} />
                  </a>
                  <button onClick={() => deleteMessage(selected.id)} className="p-2 rounded-lg text-gray-400 hover:text-brand-red hover:bg-brand-red/8 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-gray-50 rounded-xl p-5 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              {/* Reply button */}
              <div className="px-6 py-4 border-t border-gray-100">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="btn-secondary w-full justify-center"
                >
                  <Reply size={16} /> Reply via Email
                </a>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Mail size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}