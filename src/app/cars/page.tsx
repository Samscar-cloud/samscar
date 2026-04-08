import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { CarCard } from '@/components/CarCard'
import { CarFilters } from '@/components/CarFilters'

export default async function CarsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const make = typeof searchParams.make === 'string' ? searchParams.make.trim() : undefined
  const year = typeof searchParams.year === 'string' ? Number(searchParams.year) : undefined
  const minPrice = typeof searchParams.minPrice === 'string' ? Number(searchParams.minPrice) : undefined
  const maxPrice = typeof searchParams.maxPrice === 'string' ? Number(searchParams.maxPrice) : undefined
  const q = typeof searchParams.q === 'string' ? searchParams.q.trim() : undefined

  const makeFilter = make ? { make: { contains: make, mode: 'insensitive' } } : undefined
  const yearFilter = year && !Number.isNaN(year) ? { year } : undefined
  const minPriceFilter = minPrice && !Number.isNaN(minPrice) ? { price: { gte: minPrice } } : undefined
  const maxPriceFilter = maxPrice && !Number.isNaN(maxPrice) ? { price: { lte: maxPrice } } : undefined
  const searchFilter = q
    ? {
        OR: [
          { make: { contains: q, mode: 'insensitive' } },
          { model: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      }
    : undefined

  const where: any = { status: 'AVAILABLE' }
  const and = [makeFilter, yearFilter, minPriceFilter, maxPriceFilter, searchFilter].filter(Boolean)
  if (and.length) where.AND = and

  const [listings, makes, years] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.listing.findMany({
      distinct: ['make'],
      select: { make: true },
      orderBy: { make: 'asc' },
    }),
    prisma.listing.findMany({
      distinct: ['year'],
      select: { year: true },
      orderBy: { year: 'desc' },
    }),
  ])

  const makeList = makes.map((m) => m.make)
  const yearsList = years.map((y) => y.year)

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 space-y-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Catalogue véhicules</h1>
            <p className="text-gray-600 mt-1">Trouvez le véhicule qui vous convient et demandez un test-drive.</p>
          </div>
        </header>
        <Suspense fallback={<div className="bg-white rounded-xl shadow p-6">Chargement des filtres...</div>}>
          <CarFilters makes={makeList} years={yearsList} />
        </Suspense>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow p-6 text-center">
              <p className="text-gray-700">Aucun véhicule trouvé avec ces critères.</p>
            </div>
          ) : (
            listings.map((listing) => (
              <CarCard
                key={listing.id}
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
            ))
          )}
        </div>
      </div>
    </main>
  )
}
