import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors } from './_lib/cors'
import { supabase } from './_lib/supabase'
import { resend, FROM_EMAIL, emailTemplate } from './_lib/resend'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return

  if (req.method === 'POST') {
    try {
      const { email, name } = req.body
      if (!email) return res.status(400).json({ error: 'Email required' })

      // Check existing
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id, active')
        .eq('email', email)
        .single()

      if (existing) {
        if (existing.active) return res.json({ success: true, message: 'Already subscribed!' })
        await supabase.from('newsletter_subscribers').update({ active: true }).eq('email', email)
      } else {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert([{ email, name: name || '', active: true }])
        if (error) throw error
      }

      // Welcome email
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [email],
        subject: 'Welcome to the Hesabika Newsletter!',
        html: emailTemplate(`
          <h2 style="font-family:Georgia,serif;color:#166935;margin:0 0 16px;">
            Welcome${name ? `, ${name}` : ''}! 🎉
          </h2>
          <p style="color:#444;font-size:15px;line-height:1.7;">
            Thank you for subscribing to the Hesabika Trust newsletter. You're now part of a growing community of Kenyans committed to transformation.
          </p>
          <p style="color:#444;font-size:14px;line-height:1.7;margin-top:16px;">You'll receive updates on:</p>
          <ul style="color:#555;font-size:14px;line-height:2.4;padding-left:20px;">
            <li>🏛️ GIPro intern stories and programme updates</li>
            <li>📰 ACT Bulletin — our quarterly newsletter</li>
            <li>🎯 Hesabika events and new initiatives</li>
            <li>💡 Governance insights and resources</li>
            <li>🤝 Ways to get involved and make a difference</li>
          </ul>
          <div style="margin:24px 0;padding:16px;background:#f5f5f0;border-radius:8px;border-left:4px solid #166935;">
            <p style="margin:0;font-size:13px;color:#555;font-style:italic;line-height:1.7;">
              "The only thing necessary for the triumph of evil is for good men to do nothing." — Edmund Burke
            </p>
          </div>
          <p style="color:#444;font-size:14px;line-height:1.7;">
            Stand up and be counted for the transformation of Kenya.
          </p>
          <div style="margin-top:24px;">
            <a href="https://hesabika-react.vercel.app" style="display:inline-block;background:#166935;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">
              Visit Hesabika Trust →
            </a>
          </div>
        `)
      })

      return res.json({ success: true, message: 'Subscribed successfully!' })
    } catch (err) {
      console.error('Newsletter subscribe error:', err)
      return res.status(500).json({ error: 'Failed to subscribe' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ error: 'Email required' })
      await supabase.from('newsletter_subscribers').update({ active: false }).eq('email', email)
      return res.json({ success: true, message: 'Unsubscribed successfully' })
    } catch {
      return res.status(500).json({ error: 'Failed to unsubscribe' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}