import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import FocusKenyaBanner from '@/components/sections/FocusKenyaBanner'
import AboutSection from '@/components/sections/AboutSection'
import ValuesSection from '@/components/sections/ValuesSection'
import VisionMissionSection from '@/components/sections/VisionMissionSection'
import ElproHighlight from '@/components/sections/ElproHighlight'
import CaucusesPreview from '@/components/sections/CaucusesPreview'
import InitiativesPreview from '@/components/sections/InitiativesPreview'
import GiproLegacy from '@/components/sections/GiproLegacy'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import BlogPreviewSection from '@/components/sections/BlogPreviewSection'
import PartnersSection from '@/components/sections/PartnersSection'
import CTASection from '@/components/sections/CTASection'
import ContactSection from '@/components/sections/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FocusKenyaBanner />
      <AboutSection />
      <ValuesSection />
      <VisionMissionSection />
      <ElproHighlight />
      <CaucusesPreview />
      <InitiativesPreview />
      <GiproLegacy />
      <TestimonialsSection />
      <BlogPreviewSection />
      <PartnersSection />
      <CTASection />
      <ContactSection />
    </>
  )
}