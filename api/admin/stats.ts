import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors, requireAuth } from '../_lib/cors'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const userId = await requireAuth(req, res)
  if (!userId) return

  try {
    const [messages, internApps, mentorApps, subscribers, blogPosts] = await Promise.all([
      supabase.from('contact_messages').select('id, read, created_at').order('created_at', { ascending: false }),
      supabase.from('intern_applications').select('id, status, created_at').order('created_at', { ascending: false }),
      supabase.from('mentor_applications').select('id, status, created_at').order('created_at', { ascending: false }),
      supabase.from('newsletter_subscribers').select('id, active').eq('active', true),
      supabase.from('blog_posts').select('id, published, created_at').order('created_at', { ascending: false }),
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
        recent: internApps.data?.slice(0, 5) || [],
      },
      mentor_applications: {
        total: mentorApps.data?.length || 0,
        pending: mentorApps.data?.filter(a => a.status === 'pending').length || 0,
      },
      newsletter_subscribers: subscribers.data?.length || 0,
      blog_posts: {
        total: blogPosts.data?.length || 0,
        published: blogPosts.data?.filter(p => p.published).length || 0,
      },
    })
  } catch (err) {
    console.error('Stats error:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
}