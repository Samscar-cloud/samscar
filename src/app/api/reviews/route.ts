import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(500).optional(),
  bookingId: z.string().optional(),
})

export async function GET() {
  try {
    // Get all reviews with user info, sorted by newest first
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to most recent 100 reviews
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { rating, comment, bookingId } = reviewSchema.parse(body)

    // Check if user already reviewed this booking or already left a generic review
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        bookingId: bookingId ?? null,
      },
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this booking or left a general review' },
        { status: 400 }
      )
    }

    if (bookingId) {
      // Verify booking belongs to user
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      })

      if (!booking || booking.userId !== user.id) {
        return NextResponse.json({ error: 'Invalid booking' }, { status: 403 })
      }
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        rating,
        comment: comment || null,
        bookingId: bookingId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
