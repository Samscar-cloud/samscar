import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const make = url.searchParams.get('make')?.trim()
  const year = url.searchParams.get('year')
  const minPrice = url.searchParams.get('minPrice')
  const maxPrice = url.searchParams.get('maxPrice')
  const q = url.searchParams.get('q')?.trim()

  const where: any = { status: 'AVAILABLE' }

  const filters: any[] = []
  if (make) filters.push({ make: { contains: make, mode: 'insensitive' } })
  if (year && !Number.isNaN(Number(year))) filters.push({ year: Number(year) })
  if (minPrice && !Number.isNaN(Number(minPrice))) filters.push({ price: { gte: Number(minPrice) } })
  if (maxPrice && !Number.isNaN(Number(maxPrice))) filters.push({ price: { lte: Number(maxPrice) } })
  if (q) {
    filters.push({
      OR: [
        { make: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    })
  }

  if (filters.length > 0) {
    where.AND = filters
  }

  const listings = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(listings)
}
