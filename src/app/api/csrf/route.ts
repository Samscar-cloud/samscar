import { NextResponse, NextRequest } from 'next/server'
import { randomUUID } from 'crypto'

const CSRF_COOKIE_NAME = 'csrf-token'

export async function GET(request: NextRequest) {
  const existingToken = request.cookies.get(CSRF_COOKIE_NAME)?.value

  if (existingToken) {
    return NextResponse.json({ csrfToken: existingToken })
  }

  const token = randomUUID()
  const res = NextResponse.json({ csrfToken: token })
  res.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 15, // 15 minutes
  })
  return res
}
