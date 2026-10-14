import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Star, Filter } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { supabase } from '@/lib/supabase'
import { formatDateShort } from '@/lib/utils'
import toast from 'react-hot-toast'
import { BLOG_POSTS } from '@/lib/data'

type Post = {
  id: string
  title: string
  slug: string
  author: string
  category: string
  published: boolean
  featured: boolean
  created_at: string
  read_time: number
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '', slug: '', excerpt: '', content: '', author: 'Hesabika Team',
    category: 'GIPro Story', image_url: '/images/blog-1.jpg',
    published: false, featured: false, read_time: 4, tags: '',
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, author, category, published, featured, created_at, read_time')
        .order('created_at', { ascending: false })

      if (error) throw error
      // Merge with static data if DB is empty
      if (!data || data.length === 0) {
        setPosts(BLOG_POSTS.map(p => ({ ...p, read_time: p.read_time })) as any)
      } else {
        setPosts(data)
      }
    } catch {
      setPosts(BLOG_POSTS.map(p => ({ ...p })) as any)
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (post: Post) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !post.published })
        .eq('id', post.id)
      if (error) throw error
      setPosts(posts.map(p => p.id === post.id ? { ...p, published: !p.published } : p))
      toast.success(`Post ${!post.published ? 'published' : 'unpublished'}`)
    } catch {
      toast.error('Failed to update post')
    }
  }

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      setPosts(posts.filter(p => p.id !== id))
      toast.success('Post deleted')
    } catch {
      toast.error('Failed to delete post')
    }
  }

  const savePost = async () => {
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      }
      if (editingPost) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id)
        if (error) throw error
        toast.success('Post updated!')
      } else {
        const { error } = await supabase.from('blog_posts').insert([payload])
        if (error) throw error
        toast.success('Post created!')
      }
      setShowEditor(false)
      setEditingPost(null)
      fetchPosts()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save post')
    }
  }

  const openEditor = (post?: any) => {
    if (post) {
      setEditingPost(post)
      setFormData({ ...post, tags: Array.isArray(post.tags) ? post.tags.join(', ') : '' })
    } else {
      setEditingPost(null)
      setFormData({ title: '', slug: '', excerpt: '', content: '', author: 'Hesabika Team', category: 'GIPro Story', image_url: '/images/blog-1.jpg', published: false, featured: false, read_time: 4, tags: '' })
    }
    setShowEditor(true)
  }

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'published' ? p.published : !p.published)
    return matchSearch && matchFilter
  })

  return (
    <AdminLayout
      title="Blog Posts"
      subtitle={`${posts.length} posts · ${posts.filter(p => p.published).length} published`}
      actions={
        <button onClick={() => openEditor()} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
          <Plus size={15} /> New Post
        </button>
      }
    >
      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">{editingPost ? 'Edit Post' : 'New Blog Post'}</h2>
              <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Title *</label>
                  <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Post title" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Slug</label>
                  <input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="auto-generated" className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Author</label>
                  <input value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="form-input" />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="form-input">
                    {['GIPro Story', 'ELPro Story', 'Governance', 'Education', 'Public Service', 'Advocacy', 'General'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Read Time (min)</label>
                  <input type="number" value={formData.read_time} onChange={e => setFormData({ ...formData, read_time: +e.target.value })} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Excerpt *</label>
                <textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} rows={2} placeholder="Brief summary..." className="form-input resize-none" />
              </div>
              <div>
                <label className="form-label">Content *</label>
                <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} rows={10} placeholder="Full article content..." className="form-input resize-none font-mono text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Image URL</label>
                  <input value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} placeholder="/images/blog-1.jpg" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Tags (comma separated)</label>
                  <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="GIPro, Governance, Kenya" className="form-input" />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} className="w-4 h-4 accent-brand-green" />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 accent-brand-red" />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={savePost} className="btn-secondary flex-1 justify-center">Save Post</button>
              <button onClick={() => setShowEditor(false)} className="btn-outline-red px-6">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className="form-input pl-9" />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${filter === f ? 'bg-brand-green border-brand-green text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-brand-green'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Author</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
              <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-3/4" /></td>
                  <td className="px-5 py-4 hidden md:table-cell"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                  <td className="px-5 py-4 hidden lg:table-cell"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                  <td className="px-5 py-4 hidden lg:table-cell"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                  <td className="px-5 py-4"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
                  <td className="px-5 py-4"><div className="h-4 bg-gray-100 rounded w-16 ml-auto" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400 text-sm">No posts found</td></tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {post.featured && <Star size={13} className="text-brand-red flex-shrink-0" />}
                      <span className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs font-semibold text-brand-green bg-brand-green/8 px-2 py-1 rounded-full">{post.category}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-gray-500 text-sm">{post.author}</td>
                  <td className="px-5 py-4 hidden lg:table-cell text-gray-400 text-xs">{formatDateShort(post.created_at)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${post.published ? 'bg-brand-green/10 text-brand-green' : 'bg-gray-100 text-gray-500'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => togglePublished(post)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-green hover:bg-brand-green/8 transition-colors" title={post.published ? 'Unpublish' : 'Publish'}>
                        {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => openEditor(post)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-green hover:bg-brand-green/8 transition-colors">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => deletePost(post.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-red hover:bg-brand-red/8 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
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