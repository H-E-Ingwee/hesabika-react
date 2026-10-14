import { Router } from 'express'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const router = Router()
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
})

router.post('/subscribe', async (req, res) => {
  try {
    const data = schema.parse(req.body)

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, active')
      .eq('email', data.email)
      .single()

    if (existing) {
      if (existing.active) {
        return res.json({ success: true, message: 'Already subscribed!' })
      }
      // Reactivate
      await supabase
        .from('newsletter_subscribers')
        .update({ active: true })
        .eq('email', data.email)
    } else {
      await supabase
        .from('newsletter_subscribers')
        .insert([{ email: data.email, name: data.name || '', active: true }])
    }

    // Welcome email
    await resend.emails.send({
      from: 'Hesabika Trust <info@hesabika.com>',
      to: [data.email],
      subject: 'Welcome to the Hesabika Newsletter!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #166935, #bd2427); padding: 32px;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-family: Georgia, serif;">Welcome to Hesabika!</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Translating Concern into Action</p>
          </div>
          <div style="padding: 32px; background: white;">
            <p style="font-size: 15px; color: #444; line-height: 1.7;">Thank you for subscribing to the Hesabika Trust newsletter${data.name ? `, ${data.name}` : ''}!</p>
            <p style="font-size: 14px; color: #666; line-height: 1.7;">You'll receive updates on:</p>
            <ul style="color: #666; font-size: 14px; line-height: 2.2;">
              <li>🏛️ GIPro intern stories and updates</li>
              <li>📰 ACT Bulletin — our quarterly newsletter</li>
              <li>🎯 Hesabika events and initiatives</li>
              <li>💡 Governance insights and resources</li>
            </ul>
            <div style="margin: 24px 0; padding: 16px; background: #f5f5f0; border-radius: 8px; border-left: 4px solid #166935;">
              <p style="margin: 0; font-size: 13px; color: #555; font-style: italic;">"The only thing necessary for the triumph of evil is for good men to do nothing." — Edmund Burke</p>
            </div>
            <p style="font-size: 14px; color: #666;">Stand up and be counted for the transformation of Kenya.</p>
          </div>
          <div style="padding: 16px 32px; background: #0d0d0d; text-align: center;">
            <p style="color: rgba(255,255,255,0.3); font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Hesabika Trust · <a href="#" style="color: rgba(255,255,255,0.4);">Unsubscribe</a></p>
          </div>
        </div>
      `,
    })

    res.json({ success: true, message: 'Subscribed successfully!' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Valid email required' })
    }
    console.error('Newsletter error:', err)
    res.status(500).json({ error: 'Failed to subscribe' })
  }
})

router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body)
    await supabase.from('newsletter_subscribers').update({ active: false }).eq('email', email)
    res.json({ success: true, message: 'Unsubscribed successfully' })
  } catch {
    res.status(400).json({ error: 'Invalid email' })
  }
})

export default router