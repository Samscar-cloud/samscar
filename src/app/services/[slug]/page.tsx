import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type Props = {
  params: { slug: string }
}

export const revalidate = 60

export default async function ServicePage({ params }: Props) {
  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  })

  if (!service) return notFound()

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
        <p className="text-gray-700 mb-6">{service.description}</p>
        {service.price && <p className="text-xl font-semibold mb-6">À partir de {service.price} €</p>}
        <div className="flex gap-4">
          <a href={`/booking?serviceId=${service.id}`} className="btn-primary">
            Réserver maintenant
          </a>
          <a href="/services" className="btn-secondary">
            Retour aux services
          </a>
        </div>
      </div>
    </main>
  )
}
