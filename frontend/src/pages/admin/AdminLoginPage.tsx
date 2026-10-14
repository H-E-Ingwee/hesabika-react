import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, Shield, ArrowRight, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { signIn } from '@/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

const quotes = [
  { text: '"The only thing necessary for the triumph of evil is for good men to do nothing."', author: 'Edmund Burke' },
  { text: '"Transformation isn\'t a future event, it\'s a present-day activity."', author: 'Hesabika Trust' },
  { text: '"Politics are so dirty that the only people who can survive are Christians."', author: 'Dr. David Oginde, ELPro Launch 2026' },
  { text: '"It is a journey with few who\'ve resolved to Translate Concern to Action, yet it is fruitful."', author: 'Wabere Mwangi, Hesabika' },
]

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await signIn(data.email, data.password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Left panel — brand visual */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/hero-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-brand-green/20" />
        <div className="absolute inset-0 bg-noise opacity-30" />
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, #166935, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-15 animate-float"
          style={{ background: 'radial-gradient(circle, #bd2427, transparent)', animationDelay: '3s' }} />

        {/* Content */}
        <div className="relative z-10">
          <img src="/images/logo.png" alt="Hesabika Trust"
            className="h-10 w-auto brightness-0 invert mb-2"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#166935' }}>
            FOCUS Kenya — Societal Transformation Arm
          </p>
        </div>

        <div className="relative z-10">
          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="w-10 h-0.5 bg-brand-red mb-6" />
            <blockquote className="text-white/85 text-xl font-serif italic leading-relaxed mb-4">
              {randomQuote.text}
            </blockquote>
            <cite className="text-white/45 text-sm not-italic font-medium">— {randomQuote.author}</cite>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {[
              { value: '50+', label: 'GIPro Alumni' },
              { value: '23', label: 'ELPro Fellows' },
              { value: '5', label: 'Caucuses' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="font-serif font-black text-2xl text-white mb-0.5">{stat.value}</div>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
        {/* Subtle background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #141414 100%)' }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{ background: 'radial-gradient(circle, #166935, transparent)' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/images/logo.png" alt="Hesabika Trust"
              className="h-10 w-auto mx-auto brightness-0 invert mb-2"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#166935' }}>
              FOCUS Kenya — Societal Transformation Arm
            </p>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(22,105,53,0.15)', border: '1px solid rgba(22,105,53,0.3)' }}>
                <Shield size={18} style={{ color: '#166935' }} />
              </div>
              <div>
                <h1 className="font-serif font-bold text-white text-2xl leading-tight">Admin Dashboard</h1>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Hesabika Trust CMS</p>
              </div>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Sign in to manage content, applications, and communications.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label className="form-label-dark">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@hesabika.com"
                  className="form-input-dark pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-brand-red text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-brand-red rounded-full" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="form-label-dark">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="form-input-dark pl-10 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-brand-red text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 bg-brand-red rounded-full" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 font-semibold text-sm rounded-xl transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading ? '#166935' : 'linear-gradient(135deg, #166935, #1e8a45)',
                color: '#fff',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(22,105,53,0.35)',
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In to Dashboard
                  <ArrowRight size={14} className="ml-auto opacity-60" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Access restricted to authorised Hesabika team members only.
              <br />
              Contact{' '}
              <a href="mailto:info@hesabika.com" className="transition-colors hover:text-white/60" style={{ color: 'rgba(255,255,255,0.35)' }}>
                info@hesabika.com
              </a>{' '}
              for access.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}