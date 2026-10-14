import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors } from './_lib/cors'
import { supabase } from './_lib/supabase'
import { resend, TEAM_EMAIL, FROM_EMAIL, FROM_NOREPLY, emailTemplate, notifyTemplate } from './_lib/resend'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { first_name, last_name, email, phone, subject, message } = req.body

    if (!first_name || !last_name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ first_name, last_name, email, phone: phone || '', subject, message, read: false }])

    if (dbError) console.error('DB error:', dbError)

    // Notify team
    await resend.emails.send({
      from: FROM_NOREPLY,
      to: [TEAM_EMAIL],
      subject: `New Contact Message: ${subject}`,
      html: emailTemplate(notifyTemplate(
        '📬 New Contact Message',
        '#166935',
        [
          ['Name', `${first_name} ${last_name}`],
          ['Email', `<a href="mailto:${email}" style="color:#166935;">${email}</a>`],
          ['Phone', phone || 'Not provided'],
          ['Subject', subject],
        ],
        message.replace(/\n/g, '<br>')
      ) + `
      <div style="margin-top:20px;">
        <a href="mailto:${email}" style="display:inline-block;background:#bd2427;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">
          Reply to ${first_name}
        </a>
      </div>`)
    })

    // Auto-reply to sender
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Thank you for contacting Hesabika Trust',
      html: emailTemplate(`
        <h2 style="font-family:Georgia,serif;color:#166935;margin:0 0 16px;">Thank You, ${first_name}!</h2>
        <p style="color:#444;font-size:15px;line-height:1.7;">Thank you for reaching out to Hesabika Trust. We have received your message and will get back to you within 2 business days.</p>
        <div style="margin:20px 0;padding:14px 16px;background:#f5f5f0;border-radius:8px;border-left:4px solid #bd2427;">
          <p style="color:#666;font-size:12px;margin:0 0 4px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Your message:</p>
          <p style="color:#444;font-size:13px;line-height:1.6;margin:0;">${message.slice(0, 300)}${message.length > 300 ? '...' : ''}</p>
        </div>
        <p style="color:#444;font-size:14px;line-height:1.7;">In the meantime, explore:</p>
        <ul style="color:#444;font-size:14px;line-height:2.2;padding-left:20px;">
          <li><a href="https://hesabika-react.vercel.app/gipro" style="color:#166935;">GIPro — Governance Internship Programme</a></li>
          <li><a href="https://hesabika-react.vercel.app/blog" style="color:#166935;">Stories from our GIPro interns</a></li>
          <li><a href="https://hesabika-react.vercel.app/get-involved" style="color:#166935;">Ways to get involved</a></li>
        </ul>
        <p style="color:#444;font-size:14px;margin-top:20px;">
          📞 <a href="tel:+254718899103" style="color:#166935;">+254 718 899 103</a><br/>
          ✉️ <a href="mailto:info@hesabika.com" style="color:#166935;">info@hesabika.com</a>
        </p>
      `)
    })

    res.status(200).json({ success: true, message: 'Message sent successfully' })
  } catch (err) {
    console.error('Contact handler error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
}