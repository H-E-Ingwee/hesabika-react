import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link, useSearchParams } from 'react-router-dom'
import { Download, Play, FileText, Newspaper, ArrowRight, Clock, Search, RefreshCw } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import BlogCard from '@/components/ui/BlogCard'
import CTASection from '@/components/sections/CTASection'
import { fetchBlogPosts, fetchDownloads } from '@/lib/api'
import { formatDateShort } from '@/lib/utils'

const tabs = [
  { id: 'blog', label: 'Blog', icon: Newspaper },
  { id: 'videos', label: 'Videos', icon: Play },
  { id: 'downloads', label: 'Downloads', icon: Download },
  { id: 'bulletin', label: 'ACT Bulletin', icon: FileText },
]

const videos = [
  { title: 'GIPro 2021 Launch — Raising Leaders for Kenya', thumb: '/images/gipro-group.jpg' },
  { title: 'Hesabika Mentorship Programme Launch', thumb: '/images/mentorship.jpg' },
  { title: 'Church and Politics — Hesabika Forum', thumb: '/images/church-politics.jpg' },
  { title: 'Hesabika Bimonthly Talks — Excellence in the Marketplace', thumb: '/images/bimonthly.jpg' },
  { title: 'Hesabika National Convention Highlights', thumb: '/images/event-2.jpg' },
  { title: 'Hesabika Theme Song — Official Music Video', thumb: '/images/hero-3.jpg', href: 'https://youtu.be/QDPgdffese8' },
]

const CATEGORIES = ['All', 'GIPro Story', 'ELPro Story', 'Governance', 'Education', 'Public Service', 'Advocacy', 'General']

export default function BlogPage() {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'blog')
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState<any[]>([])
  const [downloads, setDownloads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [postsData, downloadsData] = await Promise.all([
      fetchBlogPosts(),
      fetchDownloads(),
    ])
    setPosts(postsData)
    setDownloads(downloadsData)
    setLoading(false)
  }

  const featured = posts.find((p: any) => p.featured)
  const filteredPosts = posts.filter((p: any) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <>
      <PageHero
        title="Blog & Resources"
        description="Stories, insights and resources from Hesabika Trust — GIPro intern stories, ACT Bulletin, videos and downloads."
        image="/images/hero-4.jpg"
        breadcrumbs={[{ label: 'Resources' }]}
      />

      <section className="py-24" ref={ref} style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex gap-1 mb-12 overflow-x-auto"
            style={{ borderBottom: '2px solid var(--border-subtle)' }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-0.5 transition-all duration-200"
                style={{
                  color: activeTab === tab.id ? 'var(--brand-green)' : 'var(--text-muted)',
                  borderBottomColor: activeTab === tab.id ? 'var(--brand-green)' : 'transparent',
                }}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Blog Tab */}
            {activeTab === 'blog' && (
              <motion.div key="blog" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {/* Featured post */}
                {featured && !loading && (
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden mb-10"
                    style={{ border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
                    <div className="lg:col-span-3 relative overflow-hidden h-64 lg:h-auto">
                      <img src={featured.image || featured.image_url} alt={featured.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-1.jpg' }} />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    </div>
                    <div className="lg:col-span-2 p-8 flex flex-col justify-center" style={{ background: 'var(--bg-card)' }}>
                      <span className="tag-red mb-3">Featured · {featured.category}</span>
                      <h2 className="font-serif font-bold text-2xl mb-3 leading-snug" style={{ color: 'var(--text-primary)' }}>{featured.title}</h2>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>{featured.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
                        <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{featured.author}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{featured.read_time} min</span>
                      </div>
                      <Link to={`/blog/${featured.slug}`} className="btn btn-primary w-fit">
                        Read Story <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Search + Category filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search posts…"
                      className="form-input pl-9" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setActiveCategory(cat)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                        style={{
                          background: activeCategory === cat ? 'var(--brand-red)' : 'var(--bg-muted)',
                          color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
                          border: `1px solid ${activeCategory === cat ? 'var(--brand-red)' : 'var(--border-subtle)'}`,
                        }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posts grid */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                        <div className="h-52 skeleton" />
                        <div className="p-5 space-y-3">
                          <div className="h-4 skeleton rounded w-3/4" />
                          <div className="h-3 skeleton rounded w-full" />
                          <div className="h-3 skeleton rounded w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredPosts.map((post: any, i: number) => (
                        <motion.div key={post.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
                          <BlogCard {...post} image={post.image || post.image_url} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {filteredPosts.length === 0 && (
                      <div className="col-span-3 py-16 text-center">
                        <Newspaper size={32} className="mx-auto mb-3" style={{ color: 'var(--text-faint)' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No posts found</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <motion.div key="videos" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((video, i) => (
                  <motion.div key={video.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ background: '#0d0d0d' }}>
                    <img src={video.thumb} alt={video.title} className="w-full h-48 object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-1.jpg' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-brand-red rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play size={20} className="text-white ml-1" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h5 className="text-white text-sm font-semibold leading-snug">{video.title}</h5>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Downloads Tab */}
            {activeTab === 'downloads' && (
              <motion.div key="downloads" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="space-y-3">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-20 skeleton rounded-xl" />
                  ))
                ) : downloads.map((item: any, i: number) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-center gap-4 p-5 rounded-xl transition-all duration-300 group"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--brand-green)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}>
                    <div className="w-11 h-11 min-w-[44px] rounded-xl flex items-center justify-center" style={{ background: 'rgba(189,36,39,0.1)' }}>
                      <FileText size={20} className="text-brand-red" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm mb-0.5 group-hover:text-brand-green transition-colors" style={{ color: 'var(--text-primary)' }}>{item.title}</h5>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
                      <div className="flex gap-3 mt-1 text-xs" style={{ color: 'var(--text-faint)' }}>
                        <span>{item.type || item.file_type || 'PDF'}</span>
                        <span>·</span>
                        <span>{item.size || item.file_size || ''}</span>
                      </div>
                    </div>
                    <a href={item.file_url || '#'} className="btn btn-secondary text-xs py-2 px-4 flex-shrink-0">
                      <Download size={13} /> Download
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ACT Bulletin Tab */}
            {activeTab === 'bulletin' && (
              <motion.div key="bulletin" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="text-center py-16 rounded-2xl" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(22,105,53,0.1)' }}>
                  <Newspaper size={28} className="text-brand-green" />
                </div>
                <h3 className="font-serif font-bold text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>ACT Bulletin</h3>
                <p className="max-w-md mx-auto mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  The ACT (Accountability, Courage and Transformation) Bulletin is Hesabika's quarterly newsletter featuring stories, insights and updates from across our programmes.
                </p>
                <Link to="/contact" className="btn btn-secondary">
                  Subscribe to ACT Bulletin <ArrowRight size={16} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <CTASection
        label="Stay Connected"
        title="Subscribe to Hesabika Updates"
        description="Get the latest stories, resources and updates from Hesabika Trust delivered to your inbox."
        primaryText="Subscribe"
        primaryHref="/contact"
        secondaryText="Get Involved"
        secondaryHref="/get-involved"
      />
    </>
  )
}