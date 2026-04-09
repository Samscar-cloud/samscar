import type { Metadata } from 'next'
import { Hero } from '@/components/Hero'

export const metadata: Metadata = {
  title: "Sam's Cars Hotton — Garage & Réparation Auto en Belgique",
  description: "Garage automobile à Hotton, Belgique. Réparation, entretien, changement de freins, révision complète. Prenez RDV en ligne facilement.",
  keywords: ["garage Hotton", "réparation auto Belgique", "mécanicien Hotton", "entretien voiture", "Sam's Cars"],
  openGraph: {
    title: "Sam's Cars Hotton — Garage & Réparation Auto",
    description: "Garage automobile à Hotton. Réparation, entretien, prise de RDV en ligne.",
    url: "https://samscargarage.be",
    siteName: "Sam's Cars",
    locale: "fr_BE",
    type: "website",
  },
  alternates: { canonical: "https://samscargarage.be" },
}
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