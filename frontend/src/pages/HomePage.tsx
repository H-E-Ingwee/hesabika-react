import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import AboutSection from '@/components/sections/AboutSection'
import ValuesSection from '@/components/sections/ValuesSection'
import VisionMissionSection from '@/components/sections/VisionMissionSection'
import GiproSection from '@/components/sections/GiproSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import BlogPreviewSection from '@/components/sections/BlogPreviewSection'
import PartnersSection from '@/components/sections/PartnersSection'
import CTASection from '@/components/sections/CTASection'
import ContactSection from '@/components/sections/ContactSection'
import InitiativesPreview from '@/components/sections/InitiativesPreview'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ValuesSection />
      <VisionMissionSection />
      <InitiativesPreview />
      <GiproSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <PartnersSection />
      <CTASection />
      <ContactSection />
    </>
  )
}