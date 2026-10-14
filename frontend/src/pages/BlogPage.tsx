import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { Download, Play, FileText, Newspaper, ArrowRight, Clock } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import BlogCard from '@/components/ui/BlogCard'
import CTASection from '@/components/sections/CTASection'
import { BLOG_POSTS, DOWNLOADS } from '@/lib/data'
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

const categories = ['All', 'GIPro Story', 'Public Service', 'Governance', 'Education']

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState('blog')
  const [activeCategory, setActiveCategory] = useState('All')
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  const filteredPosts =
    activeCategory === 'All'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory)

  const featured = BLOG_POSTS.find((p) => p.featured)
  const rest = BLOG_POSTS.filter((p) => !p.featured)

  return (
    <>
      <PageHero
        title="Blog & Resources"
        description="Stories, insights and resources from Hesabika Trust — GIPro intern stories, ACT Bulletin, videos and downloads."
        image="/images/hero-4.jpg"
        breadcrumbs={[{ label: 'Resources' }]}
      />

      <section className="py-24 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex gap-1 border-b-2 border-gray-100 mb-12 overflow-x-auto"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-0.5 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-brand-green border-brand-green'
                    : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Blog Tab */}
            {activeTab === 'blog' && (
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                {/* Featured post */}
                {featured && (
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-12">
                    <div className="lg:col-span-3 relative overflow-hidden h-64 lg:h-auto">
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-1.jpg' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                    </div>
                    <div className="lg:col-span-2 bg-white p-8 flex flex-col justify-center">
                      <span className="tag-red mb-3">Featured · {featured.category}</span>
                      <h2 className="font-serif font-bold text-2xl text-gray-900 mb-3 leading-snug">
                        {featured.title}
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-5">
                        <span className="font-medium text-gray-600">{featured.author}</span>
                        <span>·</span>
                        <span>{formatDateShort(featured.created_at)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{featured.read_time} min</span>
                      </div>
                      <Link to={`/blog/${featured.slug}`} className="btn-primary w-fit">
                        Read Story <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        activeCategory === cat
                          ? 'bg-brand-red border-brand-red text-white'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-brand-red hover:text-brand-red'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Posts grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredPosts.map((post, i) => (
                      <motion.div
                        key={post.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <BlogCard {...post} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {videos.map((video, i) => (
                  <motion.div
                    key={video.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group relative bg-[#0d0d0d] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={video.thumb}
                      alt={video.title}
                      className="w-full h-48 object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-1.jpg' }}
                    />
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
              <motion.div
                key="downloads"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="space-y-3"
              >
                {DOWNLOADS.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-brand-green hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-11 h-11 min-w-[44px] bg-brand-red/10 rounded-xl flex items-center justify-center">
                      <FileText size={20} className="text-brand-red" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 text-sm mb-0.5 group-hover:text-brand-green transition-colors">{item.title}</h5>
                      <p className="text-gray-400 text-xs">{item.description}</p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-gray-400">{item.type}</span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{item.size}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-brand-green text-white text-xs font-semibold rounded-lg hover:bg-brand-green-dark transition-colors flex items-center gap-1.5 flex-shrink-0">
                      <Download size={13} /> Download
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ACT Bulletin Tab */}
            {activeTab === 'bulletin' && (
              <motion.div
                key="bulletin"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="text-center py-16 bg-gray-50 rounded-2xl"
              >
                <div className="w-16 h-16 bg-brand-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><Newspaper size={28} className="text-brand-green" /></div>
                <h3 className="font-serif font-bold text-2xl text-gray-900 mb-3">ACT Bulletin</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
                  The ACT (Accountability, Courage and Transformation) Bulletin is Hesabika's quarterly newsletter featuring stories, insights and updates from across our programmes.
                </p>
                <Link to="/contact" className="btn-secondary">
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