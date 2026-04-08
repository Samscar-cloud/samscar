import { Hero } from '@/components/Hero'
import { ServicesPreview } from '@/components/ServicesPreview'
import { TrustIndicators } from '@/components/TrustIndicators'
import { Reviews } from '@/components/Reviews'
import { CTA } from '@/components/CTA'
import { LocationMap } from '@/components/LocationMap'
import { Features } from '@/components/Features'
import { FeaturedCars } from '@/components/FeaturedCars'

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <FeaturedCars />
      <ServicesPreview />
      <LocationMap />
      <TrustIndicators />
      <Reviews />
      <CTA />
    </main>
  )
}