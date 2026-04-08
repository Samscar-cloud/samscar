import Link from 'next/link'
import { ServiceCard } from './ServiceCard'

const services = [
  { name: 'Moteur', icon: '🔧', slug: 'engine' },
  { name: 'Transmission', icon: '⚙️', slug: 'transmission' },
  { name: 'Freins', icon: '🛑', slug: 'brakes' },
  { name: 'Suspension', icon: '🪜', slug: 'suspension' },
  { name: 'Électrique', icon: '⚡', slug: 'electrical' },
  { name: 'Carrosserie', icon: '🚗', slug: 'bodywork' },
]

export function ServicesPreview() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {services.map((service) => (
            <ServiceCard key={service.slug} {...service} />
          ))}
        </div>
        <div className="text-center">
          <Link href="/services" className="btn-primary">
            Voir tous les services
          </Link>
        </div>
      </div>
    </section>
  )
}