import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleCors } from '../_lib/cors'
import { supabase } from '../_lib/supabase'
import { resend, TEAM_EMAIL, FROM_EMAIL, FROM_NOREPLY, emailTemplate, notifyTemplate } from '../_lib/resend'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { first_name, last_name, email, phone, university, course, motivation } = req.body

    if (!first_name || !last_name || !email || !phone || !motivation) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (motivation.length < 50) {
      return res.status(400).json({ error: 'Motivation must be at least 50 characters' })
    }

    // Save to Supabase
    const { error: dbError } = await supabase
      .from('intern_applications')
      .insert([{ first_name, last_name, email, phone, university: university || '', course: course || '', motivation, status: 'pending' }])

    if (dbError) throw dbError

    // Notify team
    await resend.emails.send({
      from: FROM_NOREPLY,
      to: [TEAM_EMAIL],
      subject: `🎓 New GIPro Intern Application — ${first_name} ${last_name}`,
      html: emailTemplate(notifyTemplate(
        '🎓 New GIPro Intern Application',
        '#166935',
        [
          ['Name', `${first_name} ${last_name}`],
          ['Email', `<a href="mailto:${email}" style="color:#166935;">${email}</a>`],
          ['Phone', phone],
          ['University', university || 'Not specified'],
          ['Course', course || 'Not specified'],
        ],
        motivation
      ))
    })

    // Auto-reply to applicant
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: 'GIPro Application Received — Hesabika Trust',
      html: emailTemplate(`
        <h2 style="font-family:Georgia,serif;color:#166935;margin:0 0 16px;">Application Received, ${first_name}! 🎉</h2>
        <p style="color:#444;font-size:15px;line-height:1.7;">
          Thank you for your interest in the Governance Internship Programme (GIPro). We have received your application and will review it carefully.
        </p>
        <div style="margin:20px 0;padding:16px;background:#f0f9f4;border-radius:8px;border-left:4px solid #166935;">
          <p style="color:#166935;font-size:13px;font-weight:600;margin:0 0 8px;">What happens next?</p>
          <ul style="color:#444;font-size:13px;line-height:2;margin:0;padding-left:16px;">
            <li>Our team will review your application</li>
            <li>We will contact you when the next cohort opens</li>
            <li>Shortlisted candidates will be invited for interviews</li>
            <li>Selected interns begin a 12-month governance journey</li>
          </ul>
        </div>
        <p style="color:#444;font-size:14px;line-height:1.7;">
          In the meantime, read stories from our GIPro interns at 
          <a href="https://hesabika-react.vercel.app/blog" style="color:#166935;">hesabika-react.vercel.app/blog</a>
        </p>
        <p style="color:#444;font-size:14px;line-height:1.7;">
          For any questions, contact us at 
          <a href="mailto:info@hesabika.com" style="color:#166935;">info@hesabika.com</a> or 
          <a href="tel:+254718899103" style="color:#166935;">+254 718 899 103</a>
        </p>
        <p style="color:#444;font-size:14px;margin-top:20px;">
          Warm regards,<br/>
          <strong style="color:#166935;">The Hesabika Team</strong>
        </p>
      `)
    })

    res.status(200).json({ success: true, message: 'Application submitted successfully' })
  } catch (err) {
    console.error('Intern application error:', err)
    res.status(500).json({ error: 'Failed to submit application' })
  }
}