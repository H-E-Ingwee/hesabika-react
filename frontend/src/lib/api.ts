// ============================================================
// HESABIKA TRUST — Unified Data Fetching Layer
// All public pages fetch from Supabase with static fallback
// ============================================================
import { supabase } from './supabase'
import {
  BLOG_POSTS, GIPRO_INTERNS, BOARD_MEMBERS, SECRETARIAT,
  CAUCUSES, ELPRO, INITIATIVES, TESTIMONIALS, PARTNERS,
  DOWNLOADS, ADVOCACY_AREAS, STRATEGIC_PLAN
} from './data'

// ── Blog Posts ───────────────────────────────────────────────
export async function fetchBlogPosts(options?: { limit?: number; category?: string; featured?: boolean }) {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (options?.limit) query = query.limit(options.limit)
    if (options?.category) query = query.eq('category', options.category)
    if (options?.featured) query = query.eq('featured', true)

    const { data, error } = await query
    if (error || !data || data.length === 0) return BLOG_POSTS
    return data
  } catch {
    return BLOG_POSTS
  }
}

export async function fetchBlogPost(slug: string) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    if (error || !data) return BLOG_POSTS.find(p => p.slug === slug) || null
    return data
  } catch {
    return BLOG_POSTS.find(p => p.slug === slug) || null
  }
}

// ── Board Members ────────────────────────────────────────────
export async function fetchBoardMembers() {
  try {
    const { data, error } = await supabase
      .from('board_members')
      .select('*')
      .order('order_index', { ascending: true })
    if (error || !data || data.length === 0) return BOARD_MEMBERS
    return data
  } catch {
    return BOARD_MEMBERS
  }
}

// ── GIPro Interns ────────────────────────────────────────────
export async function fetchGiproInterns(cohort?: string) {
  try {
    let query = supabase
      .from('gipro_interns')
      .select('*')
      .order('order_index', { ascending: true })
    if (cohort) query = query.eq('cohort', cohort)
    const { data, error } = await query
    if (error || !data || data.length === 0) {
      return cohort ? GIPRO_INTERNS.filter(i => i.cohort === cohort) : GIPRO_INTERNS
    }
    return data
  } catch {
    return cohort ? GIPRO_INTERNS.filter(i => i.cohort === cohort) : GIPRO_INTERNS
  }
}

// ── GIPro Mentors ────────────────────────────────────────────
export async function fetchGiproMentors() {
  try {
    const { data, error } = await supabase
      .from('gipro_mentors')
      .select('*')
      .order('order_index', { ascending: true })
    if (error || !data || data.length === 0) return SECRETARIAT
    return data
  } catch {
    return SECRETARIAT
  }
}

// ── Secretariat ──────────────────────────────────────────────
export async function fetchSecretariat() {
  try {
    const { data, error } = await supabase
      .from('board_members')
      .select('*')
      .eq('role', 'Secretariat')
      .order('order_index', { ascending: true })
    if (error || !data || data.length === 0) return SECRETARIAT
    return data
  } catch {
    return SECRETARIAT
  }
}

// ── Events ───────────────────────────────────────────────────
export async function fetchEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('active', true)
      .order('date', { ascending: true })
    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

// ── Downloads ────────────────────────────────────────────────
export async function fetchDownloads() {
  try {
    const { data, error } = await supabase
      .from('downloads')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
    if (error || !data || data.length === 0) return DOWNLOADS
    return data
  } catch {
    return DOWNLOADS
  }
}

// ── Site Settings ────────────────────────────────────────────
export async function fetchSiteSettings() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
    if (error || !data) return null
    // Convert array of {key, value} to object
    return data.reduce((acc: Record<string, string>, row: any) => {
      acc[row.key] = row.value
      return acc
    }, {})
  } catch {
    return null
  }
}

// ── Testimonials ─────────────────────────────────────────────
export async function fetchTestimonials() {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true })
    if (error || !data || data.length === 0) return TESTIMONIALS
    return data
  } catch {
    return TESTIMONIALS
  }
}

// ── User Profile & Role ──────────────────────────────────────
export async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

export async function fetchAllProfiles() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

// ── Admin Stats ──────────────────────────────────────────────
export async function fetchAdminStats() {
  try {
    const [messages, internApps, mentorApps, subscribers, posts, interns, events] = await Promise.all([
      supabase.from('contact_messages').select('id, read, created_at, first_name, last_name, subject, email').order('created_at', { ascending: false }),
      supabase.from('intern_applications').select('id, status, created_at, first_name, last_name, email'),
      supabase.from('mentor_applications').select('id, status, created_at, full_name, email'),
      supabase.from('newsletter_subscribers').select('id, active, created_at').eq('active', true),
      supabase.from('blog_posts').select('id, published, featured, created_at, title'),
      supabase.from('gipro_interns').select('id, cohort'),
      supabase.from('events').select('id, active, date, title'),
    ])

    return {
      messages: {
        total: messages.data?.length || 0,
        unread: messages.data?.filter(m => !m.read).length || 0,
        recent: messages.data?.slice(0, 8) || [],
      },
      intern_applications: {
        total: internApps.data?.length || 0,
        pending: internApps.data?.filter(a => a.status === 'pending').length || 0,
        accepted: internApps.data?.filter(a => a.status === 'accepted').length || 0,
        recent: internApps.data?.slice(0, 5) || [],
      },
      mentor_applications: {
        total: mentorApps.data?.length || 0,
        pending: mentorApps.data?.filter(a => a.status === 'pending').length || 0,
        accepted: mentorApps.data?.filter(a => a.status === 'accepted').length || 0,
      },
      newsletter: {
        total: subscribers.data?.length || 0,
        this_month: subscribers.data?.filter(s => {
          const d = new Date(s.created_at)
          const now = new Date()
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        }).length || 0,
      },
      blog: {
        total: posts.data?.length || 0,
        published: posts.data?.filter(p => p.published).length || 0,
        featured: posts.data?.filter(p => p.featured).length || 0,
      },
      interns: {
        total: interns.data?.length || 0,
        by_cohort: interns.data?.reduce((acc: Record<string, number>, i: any) => {
          acc[i.cohort] = (acc[i.cohort] || 0) + 1
          return acc
        }, {}) || {},
      },
      events: {
        total: events.data?.length || 0,
        upcoming: events.data?.filter(e => e.active && new Date(e.date) > new Date()).length || 0,
      },
    }
  } catch (err) {
    console.error('Failed to fetch admin stats:', err)
    return null
  }
}

// ── Activity Log ─────────────────────────────────────────────
export async function fetchRecentActivity() {
  try {
    const [messages, internApps, mentorApps, subs] = await Promise.all([
      supabase.from('contact_messages').select('id, first_name, last_name, subject, created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('intern_applications').select('id, first_name, last_name, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('mentor_applications').select('id, full_name, created_at').order('created_at', { ascending: false }).limit(3),
      supabase.from('newsletter_subscribers').select('id, email, created_at').order('created_at', { ascending: false }).limit(3),
    ])

    const activity: Array<{ type: string; label: string; time: string; id: string }> = []

    messages.data?.forEach(m => activity.push({ type: 'message', label: `${m.first_name} ${m.last_name} — ${m.subject}`, time: m.created_at, id: m.id }))
    internApps.data?.forEach(a => activity.push({ type: 'intern_app', label: `ELPro application: ${a.first_name} ${a.last_name}`, time: a.created_at, id: a.id }))
    mentorApps.data?.forEach(a => activity.push({ type: 'mentor_app', label: `Mentor application: ${a.full_name}`, time: a.created_at, id: a.id }))
    subs.data?.forEach(s => activity.push({ type: 'subscriber', label: `New subscriber: ${s.email}`, time: s.created_at, id: s.id }))

    return activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 12)
  } catch {
    return []
  }
}