import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/data'
import BlogCard from '../ui/BlogCard'
import SectionHeader from '../ui/SectionHeader'

export default function BlogPreviewSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const posts = BLOG_POSTS.slice(0, 3)

  return (
    <section className="py-24 bg-white" id="blog" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              label="Latest from Hesabika"
              title="Hesabika Blog"
              labelColor="red"
              dividerColor="red"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/blog" className="btn-outline-red text-sm py-2.5 px-5">
              View All Posts
              <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <BlogCard {...post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}