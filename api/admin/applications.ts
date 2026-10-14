import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors, requireAuth } from '../_lib/cors'
import { supabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return

  const userId = await requireAuth(req, res)
  if (!userId) return

  const { type } = req.query
  const table = type === 'mentor' ? 'mentor_applications' : 'intern_applications'

  // GET — fetch all applications
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return res.json(data)
    } catch {
      return res.status(500).json({ error: 'Failed to fetch applications' })
    }
  }

  // PATCH — update status
  if (req.method === 'PATCH') {
    try {
      const { id, status } = req.body
      if (!id || !status) return res.status(400).json({ error: 'ID and status required' })
      const validStatuses = ['pending', 'reviewing', 'accepted', 'rejected']
      if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' })
      const { error } = await supabase.from(table).update({ status }).eq('id', id)
      if (error) throw error
      return res.json({ success: true })
    } catch {
      return res.status(500).json({ error: 'Failed to update application' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}