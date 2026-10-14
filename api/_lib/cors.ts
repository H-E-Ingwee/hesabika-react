import type { VercelRequest, VercelResponse } from '@vercel/node'

export function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

export function handleCors(req: VercelRequest, res: VercelResponse): boolean {
  setCors(res)
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return true
  }
  return false
}

export async function requireAuth(req: VercelRequest, res: VercelResponse): Promise<string | null> {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
  try {
    const { supabase } = await import('./supabase')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      res.status(401).json({ error: 'Invalid token' })
      return null
    }
    return user.id
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }
}