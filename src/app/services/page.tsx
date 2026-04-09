import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ServiceCard } from '@/components/ServiceCard'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Services — Réparation & Entretien Auto | Sam's Cars Hotton",
  description: "Découvrez tous nos services: changement de freins, réparation moteur, révision complète. Garage Sam's Cars à Hotton, Belgique.",
  keywords: ["services garage", "réparation freins", "révision voiture", "entretien auto Hotton"],
  openGraph: {
    title: "Services Réparation Auto — Garage Sam's Cars Hotton Belgique",
    description: "Tous nos services auto à Hotton: changement de freins, réparation moteur, révision complète, climatisation, diagnostic électronique. Prix transparents, RDV en ligne.",
    url: "https://samscargarage.be/services",
    siteName: "Sam's Cars",
    locale: "fr_BE",
    type: "website",
  },
  alternates: { canonical: "https://samscargarage.be/services" },
}

const STATIC_SERVICES = [
  { id: '1', name: 'Révision complète', description: 'Inspection complète et maintenance générale du véhicule.', price: 120, slug: 'revision-complete', icon: '🔧' },
  { id: '2', name: 'Réparation moteur', description: 'Diagnostic et réparation du moteur. Remplacement de pièces si nécessaire.', price: 450, slug: 'reparation-moteur', icon: '⚙️' },
  { id: '3', name: 'Changement des freins', description: 'Remplacement des plaquettes et disques de frein pour votre sécurité.', price: 220, slug: 'changement-freins', icon: '🛑' },
  { id: '4', name: 'Climatisation', description: 'Recharge et entretien du système de climatisation.', price: 80, slug: 'climatisation', icon: '❄️' },
  { id: '5', name: 'Pneus & Jantes', description: 'Changement, équilibrage et stockage de pneus.', price: 60, slug: 'pneus-jantes', icon: '🔵' },
  { id: '6', name: 'Diagnostic électronique', description: 'Lecture et effacement des codes défauts. Rapport complet.', price: 50, slug: 'diagnostic', icon: '💻' },
]

export default async function ServicesPage() {
  let services: { id: string; name: string; description: string | null; price: number | null; slug: string }[] = []

  try {
    services = await prisma.service.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    services = STATIC_SERVICES
  }

  const displayServices = services.length > 0 ? services : STATIC_SERVICES

  return (
    <main className="min-h-screen bg-carbon-300 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 text-sm font-semibold tracking-widest uppercase mb-4">
            Sam&apos;s cars
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Nos Services</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Un service rapide de qualité, avec ou sans rendez-vous. Des prix compétitifs et transparents, sans surcoûts additionnels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              slug={service.slug}
            />
          ))}
        </div>

        <div className="mt-20 bg-carbon-400 rounded-2xl p-8 border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6">Nos Engagements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-primary-400 mb-2">Premier diagnostic gratuit</h3>
              <p className="text-gray-400 text-sm">Lors de votre visite, une évaluation gratuite est effectuée pour vous remettre une estimation précise du prix.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-400 mb-2">Avec ou sans RDV</h3>
              <p className="text-gray-400 text-sm">Pour les petits travaux, nous prenons directement votre voiture en charge (selon disponibilité de l&apos;agenda).</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-400 mb-2">Garanties Respectées</h3>
              <p className="text-gray-400 text-sm">Toutes nos réparations maintiennent la garantie constructeur de votre véhicule.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
