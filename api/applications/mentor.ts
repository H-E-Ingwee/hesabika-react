import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors } from '../_lib/cors'
import { supabase } from '../_lib/supabase'
import { resend, TEAM_EMAIL, FROM_EMAIL, FROM_NOREPLY, emailTemplate, notifyTemplate } from '../_lib/resend'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { full_name, email, phone, profession, organization, years_experience, motivation } = req.body

    if (!full_name || !email || !phone || !motivation) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (motivation.length < 50) {
      return res.status(400).json({ error: 'Motivation must be at least 50 characters' })
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('mentor_applications')
      .insert([{
        full_name, email, phone,
        profession: profession || '',
        organization: organization || '',
        years_experience: years_experience || '5-10',
        motivation,
        status: 'pending'
      }])

    if (dbError) throw dbError

    // Notify team
    await resend.emails.send({
      from: FROM_NOREPLY,
      to: [TEAM_EMAIL],
      subject: `🤝 New GIPro Mentor Application — ${full_name}`,
      html: emailTemplate(notifyTemplate(
        '🤝 New GIPro Mentor Application',
        '#bd2427',
        [
          ['Name', full_name],
          ['Email', `<a href="mailto:${email}" style="color:#bd2427;">${email}</a>`],
          ['Phone', phone],
          ['Profession', profession || 'Not specified'],
          ['Organization', organization || 'Not specified'],
          ['Experience', years_experience || 'Not specified'],
        ],
        motivation
      ))
    })

    // Auto-reply to applicant
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Mentor Application Received — Hesabika Trust',
      html: emailTemplate(`
        <h2 style="font-family:Georgia,serif;color:#bd2427;margin:0 0 16px;">Thank You, ${full_name}! 🙏</h2>
        <p style="color:#444;font-size:15px;line-height:1.7;">
          Thank you for your willingness to invest in the next generation of Kenya's governance leaders. We are excited about your application to become a GIPro mentor.
        </p>
        <div style="margin:20px 0;padding:16px;background:#fdf5f5;border-radius:8px;border-left:4px solid #bd2427;">
          <p style="color:#bd2427;font-size:13px;font-weight:600;margin:0 0 8px;">As a GIPro Mentor, you will:</p>
          <ul style="color:#444;font-size:13px;line-height:2;margin:0;padding-left:16px;">
            <li>Be paired with a GIPro intern for 12 months</li>
            <li>Meet regularly to provide guidance and accountability</li>
            <li>Share your professional expertise and networks</li>
            <li>Help shape the future of Kenya's governance</li>
          </ul>
        </div>
        <p style="color:#444;font-size:14px;line-height:1.7;">
          We will review your application and be in touch soon. For any questions, contact us at 
          <a href="mailto:info@hesabika.com" style="color:#bd2427;">info@hesabika.com</a>
        </p>
        <p style="color:#444;font-size:14px;margin-top:20px;">
          Warm regards,<br/>
          <strong style="color:#166935;">The Hesabika Team</strong>
        </p>
      `)
    })

    res.status(200).json({ success: true, message: 'Mentor application submitted successfully' })
  } catch (err) {
    console.error('Mentor application error:', err)
    res.status(500).json({ error: 'Failed to submit application' })
  }
}