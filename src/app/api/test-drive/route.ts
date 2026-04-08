import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const testDriveSchema = z.object({
  listingId: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  preferredAt: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = testDriveSchema.parse(body)

    const listing = await prisma.listing.findUnique({ where: { id: data.listingId } })
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const preferredAt = data.preferredAt ? new Date(data.preferredAt) : null

    const record = await prisma.testDriveRequest.create({
      data: {
        listingId: data.listingId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        preferredAt,
        notes: data.notes,
      },
    })

    return NextResponse.json({ success: true, request: record })
  } catch (error) {
    console.error('Test drive request failed', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
