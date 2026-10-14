import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors, requireAuth } from '../_lib/cors'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return

  const userId = await requireAuth(req, res)
  if (!userId) return

  // GET — fetch all posts
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return res.json(data)
    } catch {
      return res.status(500).json({ error: 'Failed to fetch posts' })
    }
  }

  // POST — create post
  if (req.method === 'POST') {
    try {
      const { title, slug, excerpt, content, author, category, image_url, published, featured, tags, read_time } = req.body
      if (!title || !slug || !content) return res.status(400).json({ error: 'Title, slug and content required' })
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([{ title, slug, excerpt: excerpt || '', content, author: author || 'Hesabika Team', category: category || 'General', image_url: image_url || '/images/blog-1.jpg', published: published || false, featured: featured || false, tags: tags || [], read_time: read_time || 3 }])
        .select()
        .single()
      if (error) throw error
      return res.json(data)
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to create post' })
    }
  }

  // PUT — update post
  if (req.method === 'PUT') {
    try {
      const { id, ...updates } = req.body
      if (!id) return res.status(400).json({ error: 'Post ID required' })
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return res.json(data)
    } catch {
      return res.status(500).json({ error: 'Failed to update post' })
    }
  }

  // DELETE — delete post
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      if (!id) return res.status(400).json({ error: 'Post ID required' })
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      return res.json({ success: true })
    } catch {
      return res.status(500).json({ error: 'Failed to delete post' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}