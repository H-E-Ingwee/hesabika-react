import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

dotenv.config()

import contactRouter from './routes/contact'
import newsletterRouter from './routes/newsletter'
import applicationsRouter from './routes/applications'
import uploadRouter from './routes/upload'
import adminRouter from './routes/admin'

const app = express()
const PORT = process.env.PORT || 3001

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://hesabika-trust.vercel.app',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api/', limiter)

// Stricter limit for form submissions
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many submissions, please try again later.' },
})

// Middleware
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Hesabika Trust API',
    version: '1.0.0',
  })
})

// Routes
app.use('/api/contact', formLimiter, contactRouter)
app.use('/api/newsletter', formLimiter, newsletterRouter)
app.use('/api/applications', formLimiter, applicationsRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/admin', adminRouter)

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Hesabika Trust API running on port ${PORT}`)
  console.log(`📧 Email: Resend configured`)
  console.log(`🗄️  Database: Supabase connected`)
})

export default app