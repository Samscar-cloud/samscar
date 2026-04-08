import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession, logAdminAction } from '@/lib/admin'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { make, model, year, price, mileage, color, description, photos, status } = body

  const listing = await prisma.listing.update({
    where: { id: params.id },
    data: {
      make,
      model,
      year: year ? Number(year) : undefined,
      price: price ? Number(price) : undefined,
      mileage: mileage ? Number(mileage) : undefined,
      color: color ?? undefined,
      description: description ?? undefined,
      photos: Array.isArray(photos) ? photos : undefined,
      status: status ?? undefined,
    },
  })

  await logAdminAction(session.user.id, 'UPDATE_LISTING', `Updated listing ${listing.id} (${listing.make} ${listing.model})`)

  return NextResponse.json(listing)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const listing = await prisma.listing.findUnique({ where: { id: params.id } })
  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

  await prisma.listing.delete({ where: { id: params.id } })

  await logAdminAction(session.user.id, 'DELETE_LISTING', `Deleted listing ${params.id} (${listing.make} ${listing.model})`)

  return NextResponse.json({ success: true })
}
