import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getUserToken, consumeUserToken } from '@/lib/userTokens'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const token = String(body.token || '')
  const password = String(body.password || '')

  if (!token || !password) {
    return NextResponse.json({ error: 'Token et mot de passe requis' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 400 })
  }

  const tokenRecord = await getUserToken(token, 'PASSWORD_RESET')
  if (!tokenRecord) {
    return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: {
      password: hashedPassword,
      emailVerified: new Date(),
    },
  })

  await consumeUserToken(tokenRecord.id)

  return NextResponse.json({ ok: true })
}
