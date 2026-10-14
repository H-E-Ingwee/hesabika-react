import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ckmuptnnbnonmouynysh.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_x-qrRT-bBDcfu-csjtuksQ_4jprIRwr'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
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
          updated_at: string
          read_time: number
          tags: string[]
        }
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
      gipro_interns: {
        Row: {
          id: string
          name: string
          slug: string
          cohort: string
          placement: string
          bio: string
          image_url: string
          linkedin_url: string
          order_index: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['gipro_interns']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['gipro_interns']['Insert']>
      }
      gipro_mentors: {
        Row: {
          id: string
          name: string
          profession: string
          organization: string
          bio: string
          image_url: string
          linkedin_url: string
          order_index: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['gipro_mentors']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['gipro_mentors']['Insert']>
      }
      board_members: {
        Row: {
          id: string
          name: string
          role: string
          bio: string
          image_url: string
          order_index: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['board_members']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['board_members']['Insert']>
      }
      contact_messages: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          subject: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at' | 'read'>
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          name: string
          active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['newsletter_subscribers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>
      }
      intern_applications: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          university: string
          course: string
          motivation: string
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['intern_applications']['Row'], 'id' | 'created_at' | 'status'>
        Update: Partial<Database['public']['Tables']['intern_applications']['Insert']>
      }
      mentor_applications: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          profession: string
          organization: string
          years_experience: string
          motivation: string
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['mentor_applications']['Row'], 'id' | 'created_at' | 'status'>
        Update: Partial<Database['public']['Tables']['mentor_applications']['Insert']>
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          location: string
          image_url: string
          registration_url: string
          active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['events']['Insert']>
      }
    }
  }
}