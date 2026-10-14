import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Search,
  Star, X, Calendar, Clock, Tag, User,
  FileText, Filter, ChevronDown, ExternalLink
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AdminLayout from '@/components/admin/AdminLayout'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { supabase } from '@/lib/supabase'
import { formatDateShort, slugify } from '@/lib/utils'
import toast from 'react-hot-toast'
import { BLOG_POSTS } from '@/lib/data'
import { cn } from '@/lib/utils'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  image_url: string
  published: boolean
  featured: boolean
  created_at: string
  read_time: number
  tags: string[]
}

const CATEGORIES = ['GIPro Story', 'ELPro Story', 'Governance', 'Education', 'Public Service', 'Advocacy', 'Public Theology', 'Economy', 'Health', 'General']

const defaultForm = {
  title: '', slug: '', excerpt: '', content: '',
  author: 'Hesabika Team', category: 'GIPro Story',
  image_url: '/images/blog-1.jpg', published: false,
  featured: false, read_time: 4, tags: '',
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setPosts(data?.length ? data : BLOG_POSTS as any)
    } catch {
      setPosts(BLOG_POSTS as any)
    } finally {
      setLoading(false)
    }
  }

  const openEditor = (post?: Post) => {
    if (post) {
      setEditingPost(post)
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: post.category,
        image_url: post.image_url,
        published: post.published,
        featured: post.featured,
        read_time: post.read_time,
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      })
    } else {
      setEditingPost(null)
      setForm(defaultForm)
    }
    setPreviewMode(false)
    setEditorOpen(true)
  }

  const closeEditor = () => {
    setEditorOpen(false)
    setEditingPost(null)
    setForm(defaultForm)
  }

  const savePost = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.content.trim() || form.content === '<p></p>') { toast.error('Content is required'); return }

    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt.trim(),
        content: form.content,
        author: form.author,
        category: form.category,
        image_url: form.image_url,
        published: form.published,
        featured: form.featured,
        read_time: form.read_time,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        updated_at: new Date().toISOString(),
      }

      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id)
        if (error) throw error
        toast.success('Post updated successfully')
      } else {
        const { error } = await supabase.from('blog_posts').insert([{ ...payload, created_at: new Date().toISOString() }])
        if (error) throw error
        toast.success('Post published successfully')
      }
      closeEditor()
      fetchPosts()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  const togglePublished = async (post: Post) => {
    try {
      const { error } = await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id)
      if (error) throw error
      setPosts(posts.map(p => p.id === post.id ? { ...p, published: !p.published } : p))
      toast.success(post.published ? 'Post unpublished' : 'Post published')
    } catch { toast.error('Failed to update') }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      setPosts(posts.filter(p => p.id !== id))
      toast.success('Post deleted')
    } catch { toast.error('Failed to delete') }
  }

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter
    const matchStatus = statusFilter === 'all' || (statusFilter === 'published' ? p.published : !p.published)
    return matchSearch && matchCat && matchStatus
  })

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.published).length,
    draft: posts.filter(p => !p.published).length,
    featured: posts.filter(p => p.featured).length,
  }

  return (
    <AdminLayout
      title="Blog Posts"
      subtitle={`${stats.published} published · ${stats.draft} drafts`}
      actions={
        <button onClick={() => openEditor()} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white text-sm font-semibold rounded-lg hover:bg-brand-green-dark transition-colors">
          <Plus size={15} /> New Post
        </button>
      }
    >
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Posts', value: stats.total, color: 'text-gray-900' },
          { label: 'Published', value: stats.published, color: 'text-brand-green' },
          { label: 'Drafts', value: stats.draft, color: 'text-gray-500' },
          { label: 'Featured', value: stats.featured, color: 'text-brand-red' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-5 py-4 shadow-sm">
            <div className={`font-serif font-black text-3xl ${s.color} mb-0.5`}>{s.value}</div>
            <p className="text-gray-400 text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts by title or author…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-green bg-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-green bg-white text-gray-700"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="flex gap-1.5 bg-white border border-gray-200 rounded-lg p-1">
          {(['all', 'published', 'draft'] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={cn('px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize', statusFilter === f ? 'bg-brand-green text-white shadow-sm' : 'text-gray-500 hover:text-gray-700')}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Posts table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Post</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Author</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-3/4 mb-1" /><div className="h-3 bg-gray-100 rounded w-1/2" /></td>
                  <td className="px-5 py-4 hidden md:table-cell"><div className="h-5 bg-gray-100 rounded-full w-20" /></td>
                  <td className="px-5 py-4 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-24" /></td>
                  <td className="px-5 py-4 hidden lg:table-cell"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                  <td className="px-5 py-4"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
                  <td className="px-5 py-4"><div className="h-5 bg-gray-100 rounded w-16 ml-auto" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <FileText size={32} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm">No posts found</p>
                  <button onClick={() => openEditor()} className="mt-3 text-brand-green text-sm font-semibold hover:underline">Create your first post</button>
                </td>
              </tr>
            ) : (
              filtered.map(post => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      {post.image_url && (
                        <img src={post.image_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 hidden sm:block"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          {post.featured && <Star size={12} className="text-brand-red flex-shrink-0" />}
                          <span className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="inline-block text-xs font-semibold text-brand-green bg-brand-green/8 px-2.5 py-1 rounded-full">{post.category}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <User size={12} className="text-gray-300" />
                      {post.author}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Calendar size={11} />
                      {formatDateShort(post.created_at)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full', post.published ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-100 text-gray-500')}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', post.published ? 'bg-brand-green' : 'bg-gray-400')} />
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/blog/${post.slug}`} target="_blank"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="View post">
                        <ExternalLink size={14} />
                      </Link>
                      <button onClick={() => togglePublished(post)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-green hover:bg-brand-green/8 transition-colors"
                        title={post.published ? 'Unpublish' : 'Publish'}>
                        {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => openEditor(post)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-green hover:bg-brand-green/8 transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deletePost(post.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-brand-red hover:bg-brand-red/8 transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Full-screen Editor Modal ── */}
      <AnimatePresence>
        {editorOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-50 flex flex-col"
          >
            {/* Editor top bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={closeEditor} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <X size={18} />
                </button>
                <div>
                  <h2 className="font-semibold text-gray-900 text-sm">{editingPost ? 'Edit Post' : 'New Blog Post'}</h2>
                  <p className="text-gray-400 text-xs">{form.published ? 'Published' : 'Draft'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors', previewMode ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300')}
                >
                  <Eye size={13} /> {previewMode ? 'Edit' : 'Preview'}
                </button>
                <label className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-gray-300 transition-colors">
                  <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-3.5 h-3.5 accent-brand-green" />
                  Publish
                </label>
                <button
                  onClick={savePost}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-green text-white text-xs font-semibold rounded-lg hover:bg-brand-green-dark transition-colors disabled:opacity-60"
                >
                  {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                  {saving ? 'Saving…' : editingPost ? 'Update Post' : 'Save Post'}
                </button>
              </div>
            </div>

            {/* Editor body */}
            <div className="flex-1 overflow-hidden flex">
              {/* Main editor area */}
              <div className="flex-1 overflow-y-auto">
                {previewMode ? (
                  /* Preview */
                  <div className="max-w-3xl mx-auto px-8 py-10">
                    {form.image_url && (
                      <img src={form.image_url} alt={form.title} className="w-full h-64 object-cover rounded-2xl mb-8 shadow-sm"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    )}
                    <span className="inline-block text-xs font-bold text-brand-green bg-brand-green/8 px-3 py-1 rounded-full mb-4">{form.category}</span>
                    <h1 className="font-serif font-bold text-4xl text-gray-900 mb-4 leading-tight">{form.title || 'Untitled Post'}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
                      <span className="flex items-center gap-1.5"><User size={13} />{form.author}</span>
                      <span className="flex items-center gap-1.5"><Clock size={13} />{form.read_time} min read</span>
                    </div>
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: form.content }}
                    />
                  </div>
                ) : (
                  /* Editor */
                  <div className="max-w-3xl mx-auto px-8 py-8">
                    {/* Title */}
                    <input
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })}
                      placeholder="Post title…"
                      className="w-full text-4xl font-serif font-bold text-gray-900 placeholder:text-gray-300 outline-none border-none bg-transparent mb-4 leading-tight"
                    />
                    {/* Excerpt */}
                    <textarea
                      value={form.excerpt}
                      onChange={e => setForm({ ...form, excerpt: e.target.value })}
                      placeholder="Brief excerpt or summary (shown in blog listing)…"
                      rows={2}
                      className="w-full text-base text-gray-500 placeholder:text-gray-300 outline-none border-none bg-transparent resize-none mb-6 leading-relaxed"
                    />
                    <div className="border-t border-gray-100 mb-6" />
                    {/* Rich text editor */}
                    <RichTextEditor
                      content={form.content}
                      onChange={content => setForm({ ...form, content })}
                      placeholder="Start writing your article… Use the toolbar above to format headings, add images, links, and more."
                    />
                  </div>
                )}
              </div>

              {/* Right sidebar — post settings */}
              <div className="w-72 border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0">
                <div className="p-5 space-y-5">
                  <h3 className="font-semibold text-gray-900 text-sm">Post Settings</h3>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                    <div className="flex gap-2">
                      {[{ label: 'Draft', value: false }, { label: 'Published', value: true }].map(opt => (
                        <button key={opt.label} onClick={() => setForm({ ...form, published: opt.value })}
                          className={cn('flex-1 py-2 text-xs font-semibold rounded-lg border-2 transition-all', form.published === opt.value ? (opt.value ? 'bg-brand-green border-brand-green text-white' : 'bg-gray-900 border-gray-900 text-white') : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300')}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Featured */}
                  <div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured Post</span>
                      <div className={cn('w-10 h-5 rounded-full transition-colors relative', form.featured ? 'bg-brand-red' : 'bg-gray-200')}
                        onClick={() => setForm({ ...form, featured: !form.featured })}>
                        <div className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.featured ? 'translate-x-5' : 'translate-x-0.5')} />
                      </div>
                    </label>
                    <p className="text-xs text-gray-400 mt-1">Featured posts appear prominently on the blog page.</p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-green bg-white">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Author</label>
                    <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-green" />
                  </div>

                  {/* Read time */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Read Time (minutes)</label>
                    <input type="number" min={1} max={60} value={form.read_time} onChange={e => setForm({ ...form, read_time: +e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-green" />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">URL Slug</label>
                    <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                      placeholder="auto-generated-from-title"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-green font-mono" />
                    <p className="text-xs text-gray-400 mt-1">/blog/{form.slug || 'slug'}</p>
                  </div>

                  {/* Cover image */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Cover Image URL</label>
                    <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })}
                      placeholder="/images/blog-1.jpg"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-green" />
                    {form.image_url && (
                      <img src={form.image_url} alt="Cover preview" className="w-full h-28 object-cover rounded-lg mt-2"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
                    <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                      placeholder="GIPro, Governance, Kenya"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-green" />
                    <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
                    {form.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                          <span key={tag} className="text-xs font-semibold text-brand-green bg-brand-green/8 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}