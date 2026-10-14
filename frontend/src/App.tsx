import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'

// Public pages
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import BoardPage from '@/pages/BoardPage'
import SecretariatPage from '@/pages/SecretariatPage'
import InitiativesPage from '@/pages/InitiativesPage'
import ElproPage from '@/pages/ElproPage'
import GiproPage from '@/pages/GiproPage'
import InternsPage from '@/pages/InternsPage'
import MentorsPage from '@/pages/MentorsPage'
import CaucusesPage from '@/pages/CaucusesPage'
import AdvocacyPage from '@/pages/AdvocacyPage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'
import GetInvolvedPage from '@/pages/GetInvolvedPage'
import ContactPage from '@/pages/ContactPage'
import NotFoundPage from '@/pages/NotFoundPage'

// Admin pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminBlogPage from '@/pages/admin/AdminBlogPage'
import AdminMessagesPage from '@/pages/admin/AdminMessagesPage'
import AdminApplicationsPage from '@/pages/admin/AdminApplicationsPage'
import { AdminBoardPage, AdminSecretariatAdminPage, AdminInternsAdminPage, AdminElproFellowsPage } from '@/pages/admin/AdminTeamPage'
import AdminNewsletterPage from '@/pages/admin/AdminNewsletterPage'
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage'
import AdminUsersPage from '@/pages/admin/AdminUsersPage'

export default function App() {
  return (
    <Routes>
      {/* ── Admin routes (no public Layout) ── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/blog" element={<ProtectedRoute><AdminBlogPage /></ProtectedRoute>} />
      <Route path="/admin/messages" element={<ProtectedRoute><AdminMessagesPage /></ProtectedRoute>} />
      <Route path="/admin/applications" element={<ProtectedRoute><AdminApplicationsPage /></ProtectedRoute>} />
      <Route path="/admin/board" element={<ProtectedRoute><AdminBoardPage /></ProtectedRoute>} />
      <Route path="/admin/secretariat" element={<ProtectedRoute><AdminSecretariatAdminPage /></ProtectedRoute>} />
      <Route path="/admin/interns" element={<ProtectedRoute><AdminInternsAdminPage /></ProtectedRoute>} />
      <Route path="/admin/elpro" element={<ProtectedRoute><AdminElproFellowsPage /></ProtectedRoute>} />
      <Route path="/admin/newsletter" element={<ProtectedRoute><AdminNewsletterPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />

      {/* ── Public routes (with Layout) ── */}
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/about/board" element={<BoardPage />} />
            <Route path="/about/secretariat" element={<SecretariatPage />} />
            <Route path="/initiatives" element={<InitiativesPage />} />
            <Route path="/elpro" element={<ElproPage />} />
            <Route path="/gipro" element={<GiproPage />} />
            <Route path="/gipro/interns" element={<InternsPage />} />
            <Route path="/gipro/mentors" element={<MentorsPage />} />
            <Route path="/caucuses" element={<CaucusesPage />} />
            <Route path="/advocacy" element={<AdvocacyPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/get-involved" element={<GetInvolvedPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  )
}