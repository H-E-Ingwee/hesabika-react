import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export type UserRole = 'superadmin' | 'admin' | 'editor' | 'viewer' | null

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url: string
  department: string
  is_active: boolean
  last_login: string
}

export function useRole() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setProfile(null); setLoading(false); return }
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    if (!user) return
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(data)
    } catch {
      // Profile may not exist yet
      setProfile({ id: user.id, email: user.email || '', full_name: '', role: 'viewer', avatar_url: '', department: '', is_active: true, last_login: '' })
    } finally {
      setLoading(false)
    }
  }

  const role = profile?.role || null
  const isSuperAdmin = role === 'superadmin'
  const isAdmin = role === 'superadmin' || role === 'admin'
  const isEditor = role === 'superadmin' || role === 'admin' || role === 'editor'
  const isViewer = !!role

  // Permission checks
  const can = {
    // Content
    createPost: isEditor,
    editPost: isEditor,
    deletePost: isAdmin,
    publishPost: isEditor,
    // Team
    manageTeam: isAdmin,
    // Applications
    viewApplications: isViewer,
    updateApplicationStatus: isEditor,
    // Messages
    viewMessages: isViewer,
    deleteMessages: isAdmin,
    // Newsletter
    viewSubscribers: isViewer,
    exportSubscribers: isAdmin,
    // Settings
    viewSettings: isViewer,
    editSettings: isAdmin,
    editSiteSettings: isSuperAdmin,
    // Users
    viewUsers: isAdmin,
    manageUsers: isSuperAdmin,
    inviteUsers: isAdmin,
    changeRoles: isSuperAdmin,
    // Media
    uploadMedia: isEditor,
    deleteMedia: isAdmin,
    // Events
    manageEvents: isEditor,
    // Announcements
    manageAnnouncements: isAdmin,
    // Activity log
    viewActivityLog: isAdmin,
    // Caucuses
    manageCaucuses: isAdmin,
    // Initiatives
    manageInitiatives: isAdmin,
  }

  return { profile, role, loading, isSuperAdmin, isAdmin, isEditor, isViewer, can, refetch: fetchProfile }
}