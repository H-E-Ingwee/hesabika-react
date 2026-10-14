import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <div className="font-serif font-black text-[120px] leading-none text-white/5 mb-4">
          404
        </div>
        <div className="font-serif font-bold text-white text-3xl mb-4 -mt-8">
          Page Not Found
        </div>
        <p className="text-white/50 leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={16} /> Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-outline-white"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-12 pt-8 border-t border-white/8">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: 'About', href: '/about' },
              { label: 'GIPro', href: '/gipro' },
              { label: 'Blog', href: '/blog' },
              { label: 'Get Involved', href: '/get-involved' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-white/40 text-sm hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}