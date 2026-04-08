import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    include: {
      service: true,
      vehicle: true,
      review: true,
    },
  })

  return NextResponse.json(
    bookings.map((booking) => ({
      id: booking.id,
      date: booking.date,
      status: booking.status,
      notes: booking.notes,
      service: {
        id: booking.service.id,
        name: booking.service.name,
        category: booking.service.category,
      },
      vehicle: booking.vehicle
        ? {
            id: booking.vehicle.id,
            make: booking.vehicle.make,
            model: booking.vehicle.model,
            year: booking.vehicle.year,
            vin: booking.vehicle.vin,
          }
        : null,
      review: booking.review
        ? {
            id: booking.review.id,
            rating: booking.review.rating,
            comment: booking.review.comment,
            createdAt: booking.review.createdAt,
          }
        : null,
      createdAt: booking.createdAt,
    }))
  )
}
