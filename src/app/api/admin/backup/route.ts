import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin'

export async function GET() {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [users, services, vehicles, bookings, listings, testDriveRequests] = await Promise.all([
    prisma.user.findMany(),
    prisma.service.findMany(),
    prisma.vehicle.findMany(),
    prisma.booking.findMany(),
    prisma.listing.findMany(),
    prisma.testDriveRequest.findMany(),
  ])

  const backup = {
    createdAt: new Date().toISOString(),
    users,
    services,
    vehicles,
    bookings,
    listings,
    testDriveRequests,
  }

  const json = JSON.stringify(backup, null, 2)
  return new NextResponse(json, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  })
}
