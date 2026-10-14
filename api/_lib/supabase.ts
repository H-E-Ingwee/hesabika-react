import { createClient } from '@supabase/supabase-js'

// Server-side only — uses SECRET key, never exposed to browser
const supabaseUrl = process.env.SUPABASE_URL
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !supabaseSecretKey) {
  console.warn('Supabase server environment variables not set.')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseSecretKey || ''
)