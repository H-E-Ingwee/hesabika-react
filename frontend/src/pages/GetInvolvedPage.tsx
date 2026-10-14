import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Heart, GraduationCap, Users, Briefcase, ArrowRight, CheckCircle, Send } from 'lucide-react'
import PageHero from '@/components/ui/PageHero'
import SectionHeader from '@/components/ui/SectionHeader'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { supabase } from '@/lib/supabase'

// Schemas
const internSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  university: z.string().min(2),
  course: z.string().min(2),
  motivation: z.string().min(50, 'Please write at least 50 characters'),
})

const mentorSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  profession: z.string().min(2),
  organization: z.string().min(2),
  years_experience: z.string(),
  motivation: z.string().min(50, 'Please write at least 50 characters'),
})

type InternForm = z.infer<typeof internSchema>
type MentorForm = z.infer<typeof mentorSchema>

const amounts = ['KES 500', 'KES 1,000', 'KES 2,000', 'KES 5,000', 'KES 10,000', 'Other']

const ways = [
  { id: 'give', icon: Heart, title: 'Give / Donate', desc: 'Support GIPro interns financially', color: 'red' },
  { id: 'intern', icon: GraduationCap, title: 'Become an Intern', desc: 'Apply for the GIPro programme', color: 'green' },
  { id: 'mentor', icon: Users, title: 'Become a Mentor', desc: 'Guide the next generation', color: 'red' },
  { id: 'careers', icon: Briefcase, title: 'Careers', desc: 'Join the Hesabika team', color: 'green' },
]

const jobs = [
  { title: 'Communications & Social Media Officer', desc: 'Lead Hesabika\'s communications strategy, manage social media platforms and create compelling content.', type: 'Full-time', location: 'Nairobi', status: 'Open' },
  { title: 'Programme Officer — GIPro', desc: 'Coordinate the day-to-day operations of the Governance Internship Programme, supporting interns and mentors.', type: 'Full-time', location: 'Nairobi', status: 'Open' },
  { title: 'Fundraising & Partnerships Officer', desc: 'Develop and manage relationships with donors, partners and supporters to sustain and grow Hesabika\'s programmes.', type: 'Full-time', location: 'Nairobi', status: 'Coming Soon' },
]

function InternForm() {
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InternForm>({ resolver: zodResolver(internSchema) })

  const onSubmit = async (data: InternForm) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/applications/intern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Application submitted! We\'ll be in touch soon.')
      reset()
    } catch {
      // Fallback to Supabase direct
      try {
        const { error } = await supabase.from('intern_applications').insert([{ ...data, status: 'pending' }])
        if (error) throw error
        toast.success('Application submitted! We\'ll be in touch soon.')
        reset()
      } catch {
        toast.error('Failed to submit. Please email info@hesabika.com')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">First Name *</label>
          <input {...register('first_name')} placeholder="First name" className="form-input" />
          {errors.first_name && <p className="text-brand-red text-xs mt-1">Required</p>}
        </div>
        <div>
          <label className="form-label">Last Name *</label>
          <input {...register('last_name')} placeholder="Last name" className="form-input" />
          {errors.last_name && <p className="text-brand-red text-xs mt-1">Required</p>}
        </div>
      </div>
      <div>
        <label className="form-label">Email Address *</label>
        <input {...register('email')} type="email" placeholder="your@email.com" className="form-input" />
        {errors.email && <p className="text-brand-red text-xs mt-1">Valid email required</p>}
      </div>
      <div>
        <label className="form-label">Phone Number *</label>
        <input {...register('phone')} type="tel" placeholder="+254 7XX XXX XXX" className="form-input" />
        {errors.phone && <p className="text-brand-red text-xs mt-1">Required</p>}
      </div>
      <div>
        <label className="form-label">University / Institution</label>
        <input {...register('university')} placeholder="Your university or institution" className="form-input" />
      </div>
      <div>
        <label className="form-label">Course / Field of Study</label>
        <input {...register('course')} placeholder="e.g. Law, Public Administration, Political Science" className="form-input" />
      </div>
      <div>
        <label className="form-label">Why do you want to join GIPro? *</label>
        <textarea {...register('motivation')} rows={4} placeholder="Tell us about your passion for governance and public service..." className="form-input resize-none" />
        {errors.motivation && <p className="text-brand-red text-xs mt-1">{errors.motivation.message}</p>}
      </div>
      <button type="submit" disabled={submitting} className="btn-secondary w-full justify-center disabled:opacity-60">
        {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</> : <><Send size={16} />Register Interest</>}
      </button>
    </form>
  )
}

function MentorFormComponent() {
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MentorForm>({ resolver: zodResolver(mentorSchema) })

  const onSubmit = async (data: MentorForm) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/applications/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Application submitted! We\'ll be in touch soon.')
      reset()
    } catch {
      try {
        const { error } = await supabase.from('mentor_applications').insert([{ ...data, status: 'pending' }])
        if (error) throw error
        toast.success('Application submitted! We\'ll be in touch soon.')
        reset()
      } catch {
        toast.error('Failed to submit. Please email info@hesabika.com')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="form-label">Full Name *</label>
        <input {...register('full_name')} placeholder="Your full name" className="form-input" />
        {errors.full_name && <p className="text-brand-red text-xs mt-1">Required</p>}
      </div>
      <div>
        <label className="form-label">Email Address *</label>
        <input {...register('email')} type="email" placeholder="your@email.com" className="form-input" />
        {errors.email && <p className="text-brand-red text-xs mt-1">Valid email required</p>}
      </div>
      <div>
        <label className="form-label">Phone Number *</label>
        <input {...register('phone')} type="tel" placeholder="+254 7XX XXX XXX" className="form-input" />
      </div>
      <div>
        <label className="form-label">Profession / Field</label>
        <input {...register('profession')} placeholder="e.g. Lawyer, Engineer, Public Administrator" className="form-input" />
      </div>
      <div>
        <label className="form-label">Organization</label>
        <input {...register('organization')} placeholder="Your current organization" className="form-input" />
      </div>
      <div>
        <label className="form-label">Years of Experience</label>
        <select {...register('years_experience')} className="form-input">
          <option value="5-10">5–10 years</option>
          <option value="10-15">10–15 years</option>
          <option value="15-20">15–20 years</option>
          <option value="20+">20+ years</option>
        </select>
      </div>
      <div>
        <label className="form-label">Why do you want to mentor? *</label>
        <textarea {...register('motivation')} rows={3} placeholder="Tell us about your passion for mentoring Kenya's next generation..." className="form-input resize-none" />
        {errors.motivation && <p className="text-brand-red text-xs mt-1">{errors.motivation.message}</p>}
      </div>
      <button type="submit" disabled={submitting} className="btn-secondary w-full justify-center disabled:opacity-60">
        {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting…</> : <><Send size={16} />Apply as Mentor</>}
      </button>
    </form>
  )
}

export default function GetInvolvedPage() {
  const [selectedAmount, setSelectedAmount] = useState('KES 1,000')
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true })

  return (
    <>
      <PageHero
        title="Get Involved"
        description="There are many ways to partner with Hesabika — give, serve, mentor or join our team. Every contribution matters."
        image="/images/hero-2.jpg"
        breadcrumbs={[{ label: 'Get Involved' }]}
      />

      {/* Ways grid */}
      <section className="py-20 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
            <SectionHeader label="How You Can Help" title="Ways to Partner with Hesabika" center labelColor="red" dividerColor="red" />
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {ways.map((way, i) => (
              <motion.a
                key={way.id}
                href={`#${way.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-brand-green hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-green transition-colors duration-300">
                  <way.icon size={26} className="text-brand-green group-hover:text-white transition-colors duration-300" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{way.title}</h4>
                <p className="text-gray-500 text-xs">{way.desc}</p>
              </motion.a>
            ))}
          </div>

          {/* Give Section */}
          <div id="give" className="scroll-mt-24 mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <AnimatedSection direction="left">
                <SectionHeader label="Give" title="Support Kenya's Next Generation of Leaders" labelColor="red" dividerColor="red" />
                <div className="space-y-4 text-gray-500 leading-relaxed mb-6">
                  <p>The subsidized cost of the GIPro programme for each intern is <strong className="text-gray-900">KES 240,000</strong> (KES 20,000 per month). We are requesting just <strong className="text-gray-900">KES 1,000 per month</strong> from each supporter.</p>
                  <p>I would like to partner with Hesabika to develop the next generation of values-driven leaders for Kenya's governance.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: '📱', title: 'MPESA Paybill', detail: 'Paybill: 769936 · Account: GIPro' },
                    { icon: '🏦', title: 'Bank Transfer', detail: 'Bank of Africa · Acc: 08250710005 · SWIFT: AFRIKENX' },
                    { icon: '✉️', title: 'Other Methods', detail: 'Contact info@hesabika.com for other options' },
                  ].map((m) => (
                    <div key={m.title} className="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <span className="text-xl">{m.icon}</span>
                      <div>
                        <h5 className="font-semibold text-gray-900 text-sm mb-0.5">{m.title}</h5>
                        <p className="text-gray-500 text-xs">{m.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  <h3 className="font-serif font-bold text-xl text-gray-900 mb-1">Make a Contribution</h3>
                  <p className="text-gray-500 text-sm mb-5">Choose an amount to support a GIPro intern:</p>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {amounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setSelectedAmount(amt)}
                        className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${selectedAmount === amt ? 'bg-brand-green border-brand-green text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-brand-green hover:text-brand-green'}`}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3 mb-5">
                    <input type="text" placeholder="Full Name" className="form-input" />
                    <input type="email" placeholder="Email Address" className="form-input" />
                    <input type="tel" placeholder="+254 7XX XXX XXX" className="form-input" />
                    <select className="form-input">
                      <option>Monthly (Recommended)</option>
                      <option>One-time</option>
                      <option>Quarterly</option>
                      <option>Annual</option>
                    </select>
                  </div>
                  <button className="btn-secondary w-full justify-center">
                    <Heart size={16} /> Confirm Contribution
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">You'll receive MPESA payment instructions via email/SMS</p>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Intern Application */}
          <div id="intern" className="scroll-mt-24 mb-24">
            <div className="text-center mb-10">
              <SectionHeader label="Apply" title="Become a GIPro Intern" description="Applications for the next GIPro cohort open periodically. Register your interest below and we'll notify you when applications open." center labelColor="green" dividerColor="green" />
            </div>
            <div className="max-w-2xl mx-auto bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="font-serif font-bold text-xl text-gray-900 mb-1">Register Your Interest</h3>
              <p className="text-gray-500 text-sm mb-6">Fill in your details and we'll contact you when the next GIPro cohort opens.</p>
              <InternForm />
            </div>
          </div>

          {/* Mentor Application */}
          <div id="mentor" className="scroll-mt-24 mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <AnimatedSection direction="left">
                <SectionHeader label="Mentor" title="Become a GIPro Mentor" labelColor="red" dividerColor="red" />
                <div className="space-y-4 text-gray-500 leading-relaxed mb-6">
                  <p>GIPro mentors are experienced professionals who are passionate about Kenya's transformation and willing to invest their time, wisdom and networks in the next generation of leaders.</p>
                  <p>As a mentor, you will be paired with a GIPro intern for 12 months, providing guidance, accountability and practical wisdom.</p>
                </div>
                <div className="space-y-2">
                  {['Experienced professional with at least 5 years in your field', 'Committed Christian with strong personal values', 'Passionate about Kenya\'s governance and transformation', 'Willing to commit 2–4 hours per month to mentorship', 'Willing to model integrity, excellence and accountability'].map((q) => (
                    <div key={q} className="flex gap-2 items-start">
                      <CheckCircle size={15} className="text-brand-green flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600 text-sm">{q}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
              <AnimatedSection direction="right" delay={0.1}>
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <h3 className="font-serif font-bold text-xl text-gray-900 mb-1">Apply to Be a Mentor</h3>
                  <p className="text-gray-500 text-sm mb-6">Register your interest in becoming a GIPro mentor.</p>
                  <MentorFormComponent />
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Careers */}
          <div id="careers" className="scroll-mt-24">
            <div className="text-center mb-10">
              <SectionHeader label="Careers" title="Join the Hesabika Team" description="Work with a passionate team dedicated to Kenya's transformation. We're always looking for talented, values-driven individuals." center labelColor="red" dividerColor="red" />
            </div>
            <div className="space-y-4">
              {jobs.map((job, i) => (
                <AnimatedSection key={job.title} delay={i * 0.1}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-brand-green hover:shadow-md transition-all duration-300 group">
                    <div className="w-12 h-12 min-w-[48px] bg-brand-green/10 rounded-xl flex items-center justify-center">
                      <Briefcase size={20} className="text-brand-green" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-brand-green transition-colors">{job.title}</h4>
                      <p className="text-gray-500 text-sm mb-2">{job.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="tag-green">{job.type}</span>
                        <span className="tag-green">{job.location}</span>
                        <span className={job.status === 'Open' ? 'tag-red' : 'inline-block text-xs font-bold tracking-wider uppercase text-gray-400 bg-gray-100 px-3 py-1 rounded-full'}>{job.status}</span>
                      </div>
                    </div>
                    <a href="mailto:info@hesabika.com" className="btn-outline-green text-sm py-2 px-4 flex-shrink-0">
                      Apply Now <ArrowRight size={14} />
                    </a>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-6">
              Don't see a role that fits?{' '}
              <a href="mailto:info@hesabika.com" className="text-brand-green font-semibold hover:underline">
                Send us your CV
              </a>{' '}
              and we'll keep you in mind for future opportunities.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}