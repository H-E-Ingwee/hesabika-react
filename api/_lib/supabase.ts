import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL || 'https://ckmuptnnbnonmouynysh.supabase.co',
  process.env.SUPABASE_SECRET_KEY || ''
)