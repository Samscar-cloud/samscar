import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CarCard } from './CarCard'

export async function FeaturedCars() {
  let listings: Array<{
    id: string
    make: string
    model: string
    year: number
    price: number
    mileage: number | null
    color: string | null
    fuel?: string | null
    transmission?: string | null
    photos: string[]
    status: string
  }> = []

  try {
    listings = await prisma.listing.findMany({
      where: { status: 'AVAILABLE' },
      orderBy: { createdAt: 'desc' },
      take: 3,
    })
  } catch (error) {
    console.error('Failed to fetch featured cars:', error)
    // Silently fall back to empty array if DB is not connected
  }

  if (listings.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nouveautés & Promotions
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
              Découvrez nos derniers véhicules disponibles à la vente chez Sam&apos;s cars Hotton.
            </p>
          </div>
          <Link
            href="/cars"
            className="hidden md:inline-flex text-primary-600 hover:text-primary-700 font-semibold items-center gap-1"
          >
            Voir tout le catalogue <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <div key={listing.id} className="relative group">
              <div className="absolute -top-3 -right-3 z-10">
                <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-sm font-medium text-white shadow-lg">
                  NOUVEAUTÉ
                </span>
              </div>
              <CarCard
                id={listing.id}
                make={listing.make}
                model={listing.model}
                year={listing.year}
                price={listing.price}
                mileage={listing.mileage ?? undefined}
                color={listing.color ?? undefined}
                fuel={listing.fuel ?? undefined}
                transmission={listing.transmission ?? undefined}
                photos={listing.photos}
                status={listing.status}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/cars"
            className="inline-flex text-primary-600 hover:text-primary-700 font-semibold items-center gap-1"
          >
            Voir tout le catalogue <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
