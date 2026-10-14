import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const router = Router()
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!)

// Auth middleware
const requireAuth = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return res.status(401).json({ error: 'Invalid token' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

// Dashboard stats
router.get('/stats', requireAuth, async (_req, res) => {
  try {
    const [messages, internApps, mentorApps, subscribers] = await Promise.all([
      supabase.from('contact_messages').select('id, read, created_at').order('created_at', { ascending: false }),
      supabase.from('intern_applications').select('id, status, created_at').order('created_at', { ascending: false }),
      supabase.from('mentor_applications').select('id, status, created_at').order('created_at', { ascending: false }),
      supabase.from('newsletter_subscribers').select('id, active').eq('active', true),
    ])

    res.json({
      messages: {
        total: messages.data?.length || 0,
        unread: messages.data?.filter(m => !m.read).length || 0,
        recent: messages.data?.slice(0, 5) || [],
      },
      intern_applications: {
        total: internApps.data?.length || 0,
        pending: internApps.data?.filter(a => a.status === 'pending').length || 0,
      },
      mentor_applications: {
        total: mentorApps.data?.length || 0,
        pending: mentorApps.data?.filter(a => a.status === 'pending').length || 0,
      },
      newsletter_subscribers: subscribers.data?.length || 0,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Get all contact messages
router.get('/messages', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Mark message as read
router.patch('/messages/:id/read', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', req.params.id)
    if (error) throw error
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to update message' })
  }
})

// Get intern applications
router.get('/applications/interns', requireAuth, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('intern_applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

// Update intern application status
router.patch('/applications/interns/:id', requireAuth, async (req, res) => {
  try {
    const { status } = z.object({ status: z.enum(['pending', 'reviewing', 'accepted', 'rejected']) }).parse(req.body)
    const { error } = await supabase
      .from('intern_applications')
      .update({ status })
      .eq('id', req.params.id)
    if (error) throw error
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to update application' })
  }
})

// Get mentor applications
router.get('/applications/mentors', requireAuth, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('mentor_applications')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

// Get newsletter subscribers
router.get('/subscribers', requireAuth, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to fetch subscribers' })
  }
})

// Blog post CRUD
router.get('/blog', requireAuth, async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

router.post('/blog', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([req.body])
      .select()
      .single()
    if (error) throw error
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to create post' })
  }
})

router.put('/blog/:id', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to update post' })
  }
})

router.delete('/blog/:id', requireAuth, async (req, res) => {
  try {
    const { error } = await supabase.from('blog_posts').delete().eq('id', req.params.id)
    if (error) throw error
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Failed to delete post' })
  }
})

export default router