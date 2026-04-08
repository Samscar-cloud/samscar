import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/admin'

function toCsvRow(values: (string | number | boolean | null | undefined)[]) {
  return values
    .map((value) => {
      if (value === null || value === undefined) return ''
      const text = String(value)
      const escaped = text.replace(/"/g, '""')
      if (/[,\n\r"]/.test(escaped)) {
        return `"${escaped}"`
      }
      return escaped
    })
    .join(',')
}

export async function GET(request: Request) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true, service: true, vehicle: true },
    take: 1000,
  })

  const headers = [
    'ID',
    'Created At',
    'Service',
    'User',
    'Email',
    'Phone',
    'Vehicle',
    'Date',
    'Status',
    'Notes',
  ]

  const rows = bookings.map((booking) => [
    booking.id,
    booking.createdAt.toISOString(),
    booking.service?.name ?? '',
    booking.user?.name ?? '',
    booking.user?.email ?? '',
    booking.user?.phone ?? '',
    booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model} ${booking.vehicle.year}` : '',
    booking.date.toISOString(),
    booking.status,
    booking.notes ?? '',
  ])

  const csv = [headers, ...rows].map(toCsvRow).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="bookings-export.csv"',
    },
  })
}
