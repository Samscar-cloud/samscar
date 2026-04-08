import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserToken, consumeUserToken } from '@/lib/userTokens'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const token = String(body.token || '')

  if (!token) {
    return NextResponse.json({ error: 'Token requis' }, { status: 400 })
  }

  const tokenRecord = await getUserToken(token, 'EMAIL_VERIFICATION')
  if (!tokenRecord) {
    return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { emailVerified: new Date() },
  })

  await consumeUserToken(tokenRecord.id)

  return NextResponse.json({ ok: true })
}
