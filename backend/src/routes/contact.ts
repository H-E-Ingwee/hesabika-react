import { Router } from 'express'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const router = Router()

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(10),
})

router.post('/', async (req, res) => {
  try {
    const data = schema.parse(req.body)

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ ...data, read: false }])

    if (dbError) {
      console.error('DB error:', dbError)
    }

    // Send notification email to Hesabika team
    await resend.emails.send({
      from: 'Hesabika Website <noreply@hesabika.com>',
      to: ['info@hesabika.com'],
      subject: `New Contact Message: ${data.subject}`,
      html: `
        <div style="font-family: 'IBM Plex Sans', sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 0;">
          <div style="background: #166935; padding: 24px 32px;">
            <h1 style="color: white; font-size: 20px; margin: 0;">New Contact Message</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 13px;">Hesabika Trust Website</p>
          </div>
          <div style="padding: 32px; background: white;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #666; font-size: 13px; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600; color: #222;">${data.first_name} ${data.last_name}</td></tr>
              <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Email</td><td style="padding: 8px 0; font-weight: 600; color: #222;"><a href="mailto:${data.email}" style="color: #166935;">${data.email}</a></td></tr>
              ${data.phone ? `<tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Phone</td><td style="padding: 8px 0; font-weight: 600; color: #222;">${data.phone}</td></tr>` : ''}
              <tr><td style="padding: 8px 0; color: #666; font-size: 13px;">Subject</td><td style="padding: 8px 0; font-weight: 600; color: #222;">${data.subject}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: #f5f5f0; border-radius: 8px; border-left: 4px solid #166935;">
              <p style="color: #444; font-size: 14px; line-height: 1.7; margin: 0;">${data.message.replace(/\n/g, '<br>')}</p>
            </div>
            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee;">
              <a href="mailto:${data.email}" style="display: inline-block; background: #bd2427; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600;">Reply to ${data.first_name}</a>
            </div>
          </div>
          <div style="padding: 16px 32px; background: #f5f5f0; text-align: center;">
            <p style="color: #999; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Hesabika Trust · Translating Concern into Action</p>
          </div>
        </div>
      `,
    })

    // Send auto-reply to sender
    await resend.emails.send({
      from: 'Hesabika Trust <info@hesabika.com>',
      to: [data.email],
      subject: 'Thank you for contacting Hesabika Trust',
      html: `
        <div style="font-family: 'IBM Plex Sans', sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #166935; padding: 24px 32px;">
            <h1 style="color: white; font-size: 20px; margin: 0;">Thank You, ${data.first_name}!</h1>
          </div>
          <div style="padding: 32px; background: white;">
            <p style="color: #444; font-size: 15px; line-height: 1.7;">Thank you for reaching out to Hesabika Trust. We have received your message and will get back to you within 2 business days.</p>
            <div style="margin: 24px 0; padding: 16px; background: #f5f5f0; border-radius: 8px; border-left: 4px solid #bd2427;">
              <p style="color: #666; font-size: 13px; margin: 0 0 4px; font-weight: 600;">Your message:</p>
              <p style="color: #444; font-size: 13px; line-height: 1.6; margin: 0;">${data.message.slice(0, 200)}${data.message.length > 200 ? '...' : ''}</p>
            </div>
            <p style="color: #444; font-size: 14px; line-height: 1.7;">In the meantime, you can:</p>
            <ul style="color: #444; font-size: 14px; line-height: 2;">
              <li>Learn more about <a href="https://hesabika-trust.vercel.app/gipro" style="color: #166935;">GIPro — our Governance Internship Programme</a></li>
              <li>Read <a href="https://hesabika-trust.vercel.app/blog" style="color: #166935;">stories from our GIPro interns</a></li>
              <li>Find out how to <a href="https://hesabika-trust.vercel.app/get-involved" style="color: #166935;">get involved</a></li>
            </ul>
            <p style="color: #444; font-size: 14px; line-height: 1.7; margin-top: 20px;">For urgent matters, you can reach us at:<br>
            📞 <a href="tel:+254718899103" style="color: #166935;">+254 718 899 103</a><br>
            ✉️ <a href="mailto:info@hesabika.com" style="color: #166935;">info@hesabika.com</a></p>
          </div>
          <div style="padding: 20px 32px; background: #0d0d0d; text-align: center;">
            <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Hesabika Trust · Translating Concern into Action</p>
          </div>
        </div>
      `,
    })

    res.json({ success: true, message: 'Message sent successfully' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: err.errors })
    }
    console.error('Contact error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

export default router