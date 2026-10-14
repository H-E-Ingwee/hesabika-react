import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { MapPin, Phone, Mail, Smartphone, Facebook, Twitter, Instagram, Youtube, Linkedin, Send } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import { supabase } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/data'

const schema = z.object({
  first_name: z.string().min(2, 'Required'),
  last_name: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
})

type FormData = z.infer<typeof schema>

const contactItems = [
  { icon: MapPin, title: 'Postal Address', content: 'P.O Box 22770-00505, Nairobi, Kenya\nP.O Box 781-00618, Ruaraka, Nairobi' },
  { icon: Phone, title: 'Phone / WhatsApp', content: '+254 718 899 103', href: 'tel:+254718899103' },
  { icon: Mail, title: 'Email', content: 'info@hesabika.com', href: 'mailto:info@hesabika.com' },
  { icon: Smartphone, title: 'MPESA Giving', content: 'Paybill: 769936\nAccount: GIPro' },
]

const socialLinks = [
  { icon: Facebook, href: SITE_CONFIG.social.facebook, label: 'Facebook', color: '#1877f2' },
  { icon: Twitter, href: SITE_CONFIG.social.twitter, label: 'Twitter', color: '#1da1f2' },
  { icon: Instagram, href: SITE_CONFIG.social.instagram, label: 'Instagram', color: '#e1306c' },
  { icon: Youtube, href: SITE_CONFIG.social.youtube, label: 'YouTube', color: '#ff0000' },
  { icon: Linkedin, href: SITE_CONFIG.social.linkedin, label: 'LinkedIn', color: '#0077b5' },
]

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('API failed')
      toast.success('Message sent! We\'ll get back to you within 2 business days.')
      reset()
    } catch {
      // Fallback: direct Supabase insert
      try {
        const { error } = await supabase.from('contact_messages').insert([{ ...data, read: false }])
        if (error) throw error
        toast.success('Message received! We\'ll get back to you within 2 business days.')
        reset()
      } catch {
        toast.error('Failed to send. Please email info@hesabika.com directly.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <PageHero
        title="Contact Us"
        description="We'd love to hear from you. Reach out to learn more about Hesabika, GIPro, or how you can get involved."
        image="/images/footer-img.jpg"
        breadcrumbs={[{ label: 'Contact' }]}
      />

      {/* Contact Section */}
      <section className="py-24 bg-[#0d0d0d]" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <SectionHeader
                label="Get in Touch"
                title="We'd Love to Hear From You"
                description="Whether you want to learn more about Hesabika, apply for GIPro, become a mentor, support our work financially, or explore partnership opportunities — we're here to help."
                light
                labelColor="white"
                dividerColor="white"
              />

              <div className="mt-8 space-y-5">
                {contactItems.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-11 h-11 min-w-[44px] bg-brand-red/15 rounded-xl flex items-center justify-center">
                      <item.icon size={18} className="text-brand-red" />
                    </div>
                    <div>
                      <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-1">{item.title}</h5>
                      {item.href ? (
                        <a href={item.href} className="text-white/55 text-sm hover:text-white transition-colors whitespace-pre-line">
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-white/55 text-sm whitespace-pre-line">{item.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bank details */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8 bg-white/5 rounded-2xl p-5 border border-white/8"
              >
                <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-3">Bank Details</h5>
                <div className="space-y-1.5 text-sm">
                  {[
                    ['Bank', 'Bank of Africa, Kenya'],
                    ['Account Name', 'HESABIKA TRUST'],
                    ['Account No.', '08250710005'],
                    ['SWIFT Code', 'AFRIKENX'],
                    ['P.O. Box', '22770-00505, Nairobi'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-white/40">{label}</span>
                      <span className="text-white/80 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="glass rounded-2xl p-8">
                <h3 className="font-serif font-bold text-white text-xl mb-1">Send a Message</h3>
                <p className="text-white/50 text-sm mb-6">We'll get back to you within 2 business days.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label-dark">First Name</label>
                      <input {...register('first_name')} placeholder="John" className="form-input-dark" />
                      {errors.first_name && <p className="text-brand-red text-xs mt-1">{errors.first_name.message}</p>}
                    </div>
                    <div>
                      <label className="form-label-dark">Last Name</label>
                      <input {...register('last_name')} placeholder="Doe" className="form-input-dark" />
                      {errors.last_name && <p className="text-brand-red text-xs mt-1">{errors.last_name.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="form-label-dark">Email Address</label>
                    <input {...register('email')} type="email" placeholder="john@example.com" className="form-input-dark" />
                    {errors.email && <p className="text-brand-red text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="form-label-dark">Phone (Optional)</label>
                    <input {...register('phone')} type="tel" placeholder="+254 7XX XXX XXX" className="form-input-dark" />
                  </div>
                  <div>
                    <label className="form-label-dark">Subject</label>
                    <select {...register('subject')} className="form-input-dark">
                      <option value="">Select a subject...</option>
                      <option>General Enquiry</option>
                      <option>GIPro Application</option>
                      <option>Become a Mentor</option>
                      <option>Partnership / Giving</option>
                      <option>Media / Press</option>
                      <option>Careers</option>
                      <option>Church & Politics</option>
                      <option>Other</option>
                    </select>
                    {errors.subject && <p className="text-brand-red text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="form-label-dark">Message</label>
                    <textarea {...register('message')} rows={4} placeholder="Tell us how we can help…" className="form-input-dark resize-none" />
                    {errors.message && <p className="text-brand-red text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-60">
                    {submitting ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                    ) : (
                      <><Send size={16} />Send Message</>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="section-label">Follow Us</span>
            <h3 className="font-serif font-bold text-2xl text-gray-900 mt-1">Connect on Social Media</h3>
            <p className="text-gray-500 text-sm mt-2">Stay updated with the latest news, stories and events from Hesabika Trust.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {socialLinks.map(({ icon: Icon, href, label, color }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Icon size={28} className="mx-auto mb-2" style={{ color }} />
                <h5 className="font-bold text-gray-900 text-sm">{label}</h5>
                <p className="text-gray-400 text-xs">@HesabikaTrust</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}