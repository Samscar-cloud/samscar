import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { TestDriveForm } from '@/components/TestDriveForm'
import Link from 'next/link'

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({ where: { id: params.id } })

  if (!listing) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Véhicule introuvable</h1>
          <p className="text-gray-600 mb-6">Le véhicule que vous cherchez n&apos;existe pas ou a été retiré du catalogue.</p>
          <Link href="/cars" className="btn-primary">
            Retour au catalogue
          </Link>
        </div>
      </main>
    )
  }

  const primaryPhoto = listing.photos?.[0] || 'https://via.placeholder.com/900x500?text=No+Photo'

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="rounded-xl overflow-hidden shadow bg-white">
              <div className="relative h-96 w-full">
                <Image
                  src={primaryPhoto}
                  alt={`${listing.make} ${listing.model}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-2">
                  {listing.make} {listing.model} ({listing.year})
                </h1>
                <p className="text-xl font-semibold text-primary-700 mb-4">
                  {listing.price.toLocaleString()} €
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-semibold">Kilométrage</p>
                    <p>{listing.mileage ? `${listing.mileage.toLocaleString()} km` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Couleur</p>
                    <p>{listing.color || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Disponibilité</p>
                    <p className="capitalize">{listing.status.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Publié</p>
                    <p>{new Date(listing.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {listing.description && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:w-1/3">
            <TestDriveForm listingId={listing.id} />
          </div>
        </div>
      </div>
    </main>
  )
}
