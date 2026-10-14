import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import BoardPage from '@/pages/BoardPage'
import SecretariatPage from '@/pages/SecretariatPage'
import InitiativesPage from '@/pages/InitiativesPage'
import GiproPage from '@/pages/GiproPage'
import InternsPage from '@/pages/InternsPage'
import MentorsPage from '@/pages/MentorsPage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'
import GetInvolvedPage from '@/pages/GetInvolvedPage'
import ContactPage from '@/pages/ContactPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about/board" element={<BoardPage />} />
        <Route path="/about/secretariat" element={<SecretariatPage />} />
        <Route path="/initiatives" element={<InitiativesPage />} />
        <Route path="/gipro" element={<GiproPage />} />
        <Route path="/gipro/interns" element={<InternsPage />} />
        <Route path="/gipro/mentors" element={<MentorsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/get-involved" element={<GetInvolvedPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}