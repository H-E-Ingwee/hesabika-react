import { Router } from 'express'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const router = Router()
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

const internSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  university: z.string().min(2),
  course: z.string().min(2),
  motivation: z.string().min(50),
})

const mentorSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  profession: z.string().min(2),
  organization: z.string().min(2),
  years_experience: z.string(),
  motivation: z.string().min(50),
})

// Intern application
router.post('/intern', async (req, res) => {
  try {
    const data = internSchema.parse(req.body)

    const { error } = await supabase
      .from('intern_applications')
      .insert([{ ...data, status: 'pending' }])

    if (error) throw error

    // Notify team
    await resend.emails.send({
      from: 'Hesabika Website <noreply@hesabika.com>',
      to: ['info@hesabika.com'],
      subject: `New GIPro Intern Application — ${data.first_name} ${data.last_name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #166935; padding: 20px 28px;">
            <h2 style="color: white; margin: 0; font-size: 18px;">New GIPro Intern Application</h2>
          </div>
          <div style="padding: 28px; background: white;">
            <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>University:</strong> ${data.university}</p>
            <p><strong>Course:</strong> ${data.course}</p>
            <div style="margin-top: 16px; padding: 14px; background: #f5f5f0; border-radius: 8px; border-left: 4px solid #166935;">
              <p style="font-weight: 600; margin: 0 0 6px; font-size: 13px;">Motivation:</p>
              <p style="margin: 0; font-size: 13px; line-height: 1.6;">${data.motivation}</p>
            </div>
          </div>
        </div>
      `,
    })

    // Auto-reply
    await resend.emails.send({
      from: 'Hesabika Trust <info@hesabika.com>',
      to: [data.email],
      subject: 'GIPro Application Received — Hesabika Trust',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #166935; padding: 20px 28px;">
            <h2 style="color: white; margin: 0; font-size: 18px;">Application Received!</h2>
          </div>
          <div style="padding: 28px; background: white;">
            <p>Dear ${data.first_name},</p>
            <p>Thank you for your interest in the Governance Internship Programme (GIPro). We have received your application and will review it carefully.</p>
            <p>We will be in touch when the next cohort opens for applications. In the meantime, follow us on social media for updates.</p>
            <p>For any questions, contact us at <a href="mailto:info@hesabika.com" style="color: #166935;">info@hesabika.com</a></p>
            <p>Warm regards,<br><strong>The Hesabika Team</strong></p>
          </div>
        </div>
      `,
    })

    res.json({ success: true, message: 'Application submitted successfully' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: err.errors })
    }
    console.error('Intern application error:', err)
    res.status(500).json({ error: 'Failed to submit application' })
  }
})

// Mentor application
router.post('/mentor', async (req, res) => {
  try {
    const data = mentorSchema.parse(req.body)

    const { error } = await supabase
      .from('mentor_applications')
      .insert([{ ...data, status: 'pending' }])

    if (error) throw error

    await resend.emails.send({
      from: 'Hesabika Website <noreply@hesabika.com>',
      to: ['info@hesabika.com'],
      subject: `New GIPro Mentor Application — ${data.full_name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #bd2427; padding: 20px 28px;">
            <h2 style="color: white; margin: 0; font-size: 18px;">New GIPro Mentor Application</h2>
          </div>
          <div style="padding: 28px; background: white;">
            <p><strong>Name:</strong> ${data.full_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Profession:</strong> ${data.profession}</p>
            <p><strong>Organization:</strong> ${data.organization}</p>
            <p><strong>Experience:</strong> ${data.years_experience}</p>
            <div style="margin-top: 16px; padding: 14px; background: #f5f5f0; border-radius: 8px; border-left: 4px solid #bd2427;">
              <p style="font-weight: 600; margin: 0 0 6px; font-size: 13px;">Motivation:</p>
              <p style="margin: 0; font-size: 13px; line-height: 1.6;">${data.motivation}</p>
            </div>
          </div>
        </div>
      `,
    })

    await resend.emails.send({
      from: 'Hesabika Trust <info@hesabika.com>',
      to: [data.email],
      subject: 'Mentor Application Received — Hesabika Trust',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #bd2427; padding: 20px 28px;">
            <h2 style="color: white; margin: 0; font-size: 18px;">Mentor Application Received!</h2>
          </div>
          <div style="padding: 28px; background: white;">
            <p>Dear ${data.full_name},</p>
            <p>Thank you for your interest in becoming a GIPro mentor. We are excited about your willingness to invest in the next generation of Kenya's governance leaders.</p>
            <p>We will review your application and be in touch soon. For any questions, contact us at <a href="mailto:info@hesabika.com" style="color: #bd2427;">info@hesabika.com</a></p>
            <p>Warm regards,<br><strong>The Hesabika Team</strong></p>
          </div>
        </div>
      `,
    })

    res.json({ success: true, message: 'Mentor application submitted successfully' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: err.errors })
    }
    console.error('Mentor application error:', err)
    res.status(500).json({ error: 'Failed to submit application' })
  }
})

export default router