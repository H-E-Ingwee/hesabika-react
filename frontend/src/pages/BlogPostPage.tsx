import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, Tag, Share2, Twitter, Facebook, Link2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { BLOG_POSTS } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import BlogCard from '@/components/ui/BlogCard'
import CTASection from '@/components/sections/CTASection'

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [readProgress, setReadProgress] = useState(0)

  const post = BLOG_POSTS.find((p) => p.slug === slug)
  const related = BLOG_POSTS.filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 3)

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

  if (!post) return <Navigate to="/blog" replace />

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const paragraphs = post.content.split('\n\n').filter(Boolean)

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="fixed top-[76px] left-0 z-40 h-0.5 bg-brand-red transition-all duration-100"
        style={{ width: `${readProgress}%` }}
      />

      {/* Hero */}
      <div
        className="relative h-[480px] flex items-end"
        style={{
          backgroundImage: `url(${post.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors mb-5"
            >
              <ArrowLeft size={15} /> Back to Blog
            </Link>
            <span className="tag-red mb-4 block w-fit">{post.category}</span>
            <h1 className="font-serif font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 max-w-3xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
              <span className="font-medium text-white/80">{post.author}</span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(post.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {post.read_time} min read
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Article */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="prose prose-lg max-w-none">
                {paragraphs.map((para, i) => {
                  // Check if it's a quote (starts with ")
                  if (para.startsWith('"') || para.startsWith('\u201c')) {
                    return (
                      <blockquote
                        key={i}
                        className="border-l-4 border-brand-green bg-gray-50 px-6 py-4 rounded-r-xl my-6 italic text-gray-700 text-base leading-relaxed"
                      >
                        {para}
                      </blockquote>
                    )
                  }
                  return (
                    <p key={i} className="text-gray-600 leading-relaxed text-base mb-5">
                      {para}
                    </p>
                  )
                })}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  <Tag size={12} /> Tags:
                </span>
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-green">{tag}</span>
                ))}
              </div>

              {/* Share */}
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 size={12} /> Share:
                </span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1da1f2]/10 text-[#1da1f2] flex items-center justify-center hover:bg-[#1da1f2] hover:text-white transition-all duration-200"
                >
                  <Twitter size={15} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center hover:bg-[#1877f2] hover:text-white transition-all duration-200"
                >
                  <Facebook size={15} />
                </a>
                <button
                  onClick={copyLink}
                  className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-brand-green hover:text-white transition-all duration-200"
                >
                  <Link2 size={15} />
                </button>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Author card */}
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h4 className="font-bold text-gray-900 text-sm mb-3">About the Author</h4>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center font-serif font-bold text-brand-green">
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{post.author}</p>
                      <p className="text-brand-green text-xs font-bold">GIPro Intern</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    A values-driven young leader serving in Kenya's governance institutions through the Hesabika GIPro programme.
                  </p>
                </div>

                {/* GIPro CTA */}
                <div className="bg-brand-green rounded-2xl p-5 text-white">
                  <h4 className="font-bold text-sm mb-2">Join GIPro</h4>
                  <p className="text-white/75 text-xs leading-relaxed mb-4">
                    Want to serve Kenya like this? Apply for the next GIPro cohort.
                  </p>
                  <Link to="/get-involved#intern" className="block text-center bg-white text-brand-green text-xs font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                    Apply Now →
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="font-serif font-bold text-2xl text-gray-900 mb-8">Related Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => <BlogCard key={p.id} {...p} />)}
            </div>
          </div>
        </section>
      )}

      <CTASection
        label="GIPro"
        title="Be Part of Kenya's Transformation"
        description="Join the Governance Internship Programme and serve Kenya with integrity, excellence and accountability."
        primaryText="Apply for GIPro"
        primaryHref="/get-involved#intern"
        secondaryText="Support an Intern"
        secondaryHref="/get-involved#give"
      />
    </>
  )
}