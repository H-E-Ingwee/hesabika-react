import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, Tag, Share2, Twitter, Facebook, Link2, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { fetchBlogPost, fetchBlogPosts } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import BlogCard from '@/components/ui/BlogCard'
import CTASection from '@/components/sections/CTASection'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [readProgress, setReadProgress] = useState(0)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (slug) loadPost(slug)
  }, [slug])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setReadProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const loadPost = async (s: string) => {
    setLoading(true)
    const [postData, allPosts] = await Promise.all([
      fetchBlogPost(s),
      fetchBlogPosts(),
    ])
    if (!postData) { setNotFound(true); setLoading(false); return }
    setPost(postData)
    setRelated(allPosts.filter((p: any) => p.slug !== s && p.category === postData.category).slice(0, 3))
    setLoading(false)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!')
  }

  if (notFound) return <Navigate to="/blog" replace />

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <div className="h-[480px] skeleton" />
        <div className="max-w-4xl mx-auto px-4 py-16 space-y-4">
          <div className="h-8 skeleton rounded w-3/4" />
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-5/6" />
          <div className="h-4 skeleton rounded w-4/5" />
        </div>
      </div>
    )
  }

  if (!post) return <Navigate to="/blog" replace />

  const paragraphs = (post.content || '').split('\n\n').filter(Boolean)
  const isHtml = post.content?.includes('<')

  return (
    <>
      {/* Reading progress */}
      <div className="fixed top-[73px] left-0 z-40 h-0.5 bg-brand-red transition-all duration-100"
        style={{ width: `${readProgress}%` }} />

      {/* Hero */}
      <div className="relative h-[480px] flex items-end overflow-hidden"
        style={{ backgroundImage: `url(${post.image || post.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/50 to-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to="/blog" className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors mb-5">
              <ArrowLeft size={15} /> Back to Blog
            </Link>
            <span className="tag-red mb-4 block w-fit">{post.category}</span>
            <h1 className="font-serif font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 max-w-3xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-white/80"><User size={13} />{post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} />{formatDate(post.created_at)}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} />{post.read_time} min read</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Article */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              {isHtml ? (
                <div
                  className="ProseMirror"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <div className="space-y-5">
                  {paragraphs.map((para: string, i: number) => {
                    if (para.startsWith('"') || para.startsWith('\u201c')) {
                      return (
                        <blockquote key={i} className="border-l-4 border-brand-green px-5 py-4 rounded-r-xl my-6 italic text-sm leading-relaxed"
                          style={{ background: 'rgba(22,105,53,0.06)', color: 'var(--text-secondary)' }}>
                          {para}
                        </blockquote>
                      )
                    }
                    return <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{para}</p>
                  })}
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    <Tag size={12} /> Tags:
                  </span>
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="tag-green">{tag}</span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  <Share2 size={12} /> Share:
                </span>
                {[
                  { icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, color: '#1da1f2' },
                  { icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, color: '#1877f2' },
                ].map(({ icon: Icon, href, color }) => (
                  <a key={color} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{ background: `${color}15`, color }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = color; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}15`; (e.currentTarget as HTMLElement).style.color = color }}>
                    <Icon size={15} />
                  </a>
                ))}
                <button onClick={copyLink}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--brand-green)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-muted)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}>
                  <Link2 size={15} />
                </button>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">
                {/* Author */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                  <h4 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>About the Author</h4>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-brand-green"
                      style={{ background: 'rgba(22,105,53,0.1)' }}>
                      {post.author?.[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{post.author}</p>
                      <p className="text-brand-green text-xs font-bold">Hesabika</p>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    A values-driven leader serving Kenya through the Hesabika movement.
                  </p>
                </div>

                {/* GIPro CTA */}
                <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #166935, #0f4d26)' }}>
                  <h4 className="font-bold text-sm mb-2">Join ELPro</h4>
                  <p className="text-white/75 text-xs leading-relaxed mb-4">
                    Want to serve Kenya like this? Apply for the next ELPro cohort.
                  </p>
                  <Link to="/get-involved#elpro"
                    className="block text-center bg-white text-brand-green text-xs font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                    Apply Now
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-16" style={{ background: 'var(--bg-subtle)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-serif font-bold text-2xl mb-8" style={{ color: 'var(--text-primary)' }}>Related Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p: any) => <BlogCard key={p.id} {...p} image={p.image || p.image_url} />)}
            </div>
          </div>
        </section>
      )}

      <CTASection
        label="GIPro"
        title="Be Part of Kenya's Transformation"
        description="Join the Ethical Leaders Program and serve Kenya with integrity, excellence and accountability."
        primaryText="Apply for ELPro"
        primaryHref="/get-involved#elpro"
        secondaryText="Support an Intern"
        secondaryHref="/get-involved#give"
      />
    </>
  )
}