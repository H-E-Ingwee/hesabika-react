import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors, requireAuth } from '../_lib/cors'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return

  const userId = await requireAuth(req, res)
  if (!userId) return

  // GET — fetch all messages
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return res.json(data)
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch messages' })
    }
  }

  // PATCH — mark as read
  if (req.method === 'PATCH') {
    try {
      const { id, read } = req.body
      if (!id) return res.status(400).json({ error: 'Message ID required' })
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: read !== false })
        .eq('id', id)
      if (error) throw error
      return res.json({ success: true })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update message' })
    }
  }

  // DELETE — delete message
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body
      if (!id) return res.status(400).json({ error: 'Message ID required' })
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)
      if (error) throw error
      return res.json({ success: true })
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete message' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}