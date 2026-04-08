import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const validatePromoSchema = z.object({
  code: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = validatePromoSchema.parse(body);

    const special = await prisma.special.findUnique({
      where: { code },
    });

    if (!special || !special.isActive || (special.expiresAt && special.expiresAt < new Date())) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
    }

    if (special.usageLimit && special.usedCount >= special.usageLimit) {
      return NextResponse.json({ error: 'Promo code usage limit exceeded' }, { status: 400 });
    }

    return NextResponse.json({
      discountType: special.discountType,
      discountValue: special.discountValue,
      specialId: special.id,
    });
  } catch (error) {
    console.error('Validate promo error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}